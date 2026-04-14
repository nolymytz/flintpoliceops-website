import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 20;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMeta(html: string, property: string): string {
  // og:, twitter:, name= variants
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeHTMLEntities(m[1].trim());
  }
  return "";
}

function getTitle(html: string): string {
  const og = getMeta(html, "og:title");
  if (og) return og;
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? decodeHTMLEntities(m[1].trim()) : "";
}

function decodeHTMLEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

interface ParsedEvent {
  event_name?: string;
  description?: string;
  start_date?: string;   // YYYY-MM-DD
  start_time?: string;   // HH:MM
  end_date?: string;
  end_time?: string;
  venue?: string;
  address?: string;
  city?: string;
  website?: string;
  ticket_url?: string;
  image_url?: string;
  cost?: string;
}

/** Try to extract JSON-LD Event schema */
function parseJsonLd(html: string): ParsedEvent {
  const result: ParsedEvent = {};
  const scriptRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = scriptRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(m[1]);
      const items: unknown[] = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const obj = item as Record<string, unknown>;
        const type = (obj["@type"] as string | undefined) ?? "";
        if (!/(Event|SocialEvent|MusicEvent|TheaterEvent|SportsEvent|Festival)/i.test(type)) continue;

        if (obj.name) result.event_name = String(obj.name);
        if (obj.description) result.description = String(obj.description).slice(0, 1000);
        if (obj.image) {
          const img = obj.image;
          result.image_url = typeof img === "string" ? img : (img as Record<string,string>)?.url ?? "";
        }

        // Start date/time
        if (obj.startDate) {
          const sd = String(obj.startDate);
          const dt = new Date(sd);
          if (!isNaN(dt.getTime())) {
            result.start_date = dt.toISOString().slice(0, 10);
            const hh = dt.getHours().toString().padStart(2, "0");
            const mm = dt.getMinutes().toString().padStart(2, "0");
            if (hh !== "00" || mm !== "00") result.start_time = `${hh}:${mm}`;
          }
        }
        // End date/time
        if (obj.endDate) {
          const ed = String(obj.endDate);
          const dt = new Date(ed);
          if (!isNaN(dt.getTime())) {
            result.end_date = dt.toISOString().slice(0, 10);
            const hh = dt.getHours().toString().padStart(2, "0");
            const mm = dt.getMinutes().toString().padStart(2, "0");
            if (hh !== "00" || mm !== "00") result.end_time = `${hh}:${mm}`;
          }
        }

        // Location
        const loc = obj.location as Record<string, unknown> | undefined;
        if (loc) {
          if (loc.name) result.venue = String(loc.name);
          const addr = loc.address as Record<string, unknown> | string | undefined;
          if (typeof addr === "string") {
            result.address = addr;
          } else if (addr && typeof addr === "object") {
            if (addr.streetAddress) result.address = String(addr.streetAddress);
            if (addr.addressLocality) result.city = String(addr.addressLocality);
          }
        }

        // Offers / ticket URL
        const offers = obj.offers as Record<string, unknown> | Record<string, unknown>[] | undefined;
        if (offers) {
          const offerList = Array.isArray(offers) ? offers : [offers];
          for (const o of offerList) {
            if (o.url) { result.ticket_url = String(o.url); break; }
          }
          // Price
          const first = offerList[0];
          if (first?.price !== undefined) {
            const price = Number(first.price);
            result.cost = price === 0 ? "Free" : `$${price}`;
          }
        }

        if (result.event_name) return result; // found a good event block
      }
    } catch {
      // ignore parse errors
    }
  }
  return result;
}

/** Parse a date string like "April 15, 2026" or "Tue, Apr 15 2026" */
function parseDateString(s: string): { date?: string; time?: string } {
  if (!s) return {};
  // Try native Date parse
  const d = new Date(s);
  if (!isNaN(d.getTime()) && d.getFullYear() > 2000) {
    return {
      date: d.toISOString().slice(0, 10),
      time: (d.getHours() || d.getMinutes())
        ? `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`
        : undefined,
    };
  }
  return {};
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "No URL provided." }, { status: 400 });
    }

    // Validate URL
    let parsed: URL;
    try { parsed = new URL(url); } catch {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "Only http/https URLs are supported." }, { status: 400 });
    }

    // Fetch the page
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let html = "";
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; FlintPulseOpsBot/1.0)",
          "Accept": "text/html,application/xhtml+xml",
        },
      });
      html = await res.text();
    } catch (e) {
      return NextResponse.json({ error: "Could not fetch that URL. Try entering the details manually." }, { status: 422 });
    } finally {
      clearTimeout(timeout);
    }

    // 1. Try JSON-LD structured data first (most reliable)
    const event: ParsedEvent = parseJsonLd(html);

    // 2. Fill gaps from Open Graph / meta tags
    if (!event.event_name) event.event_name = getTitle(html);
    if (!event.description) {
      event.description = getMeta(html, "og:description") || getMeta(html, "description");
    }
    if (!event.image_url) {
      event.image_url = getMeta(html, "og:image");
    }
    if (!event.website) {
      event.website = getMeta(html, "og:url") || url;
    }

    // 3. Try to parse date from og:description or page title if still missing
    if (!event.start_date) {
      const combined = `${event.event_name ?? ""} ${event.description ?? ""}`;
      // Look for patterns like "April 15, 2026" or "4/15/2026"
      const dateMatch = combined.match(
        /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+20\d{2}\b/i
      ) || combined.match(/\b\d{1,2}\/\d{1,2}\/20\d{2}\b/);
      if (dateMatch) {
        const { date, time } = parseDateString(dateMatch[0]);
        if (date) { event.start_date = date; if (time) event.start_time = time; }
      }
    }

    // 4. Trim description
    if (event.description && event.description.length > 1000) {
      event.description = event.description.slice(0, 997) + "…";
    }

    // 5. Default city to Flint if venue found but no city
    if (event.venue && !event.city) event.city = "Flint";

    return NextResponse.json({ ok: true, event });
  } catch (err) {
    console.error("parse-event-url error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
