import Parser from "rss-parser";
import { feedSources, type County } from "@/data/feeds";
import { fetchGeneseeCountyGovItems } from "@/lib/scrapers/geneseeCountyGov";

export interface RegionalItem {
  id: string;
  sourceId: string;
  sourceName: string;
  county: County;
  title: string;
  link: string;
  excerpt: string;
  publishedAt: number; // epoch ms
  publishedDisplay: string;
}

const FEED_TIMEOUT_MS = 5000;
const MAX_ITEMS_PER_FEED = 8;
const EXCERPT_MAX_CHARS = 180;

// Decode common HTML entities including numeric ones like &#8217;
function decodeHtmlEntities(raw: string): string {
  return raw
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&hellip;/g, "\u2026");
}

// Strip HTML tags and normalize whitespace. We only show a short excerpt
// that links out to the original source — no full-body reproduction.
function cleanExcerpt(raw: string | undefined): string {
  if (!raw) return "";
  const stripped = decodeHtmlEntities(raw)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length <= EXCERPT_MAX_CHARS) return stripped;
  return stripped.slice(0, EXCERPT_MAX_CHARS - 1).trimEnd() + "\u2026";
}

// Clean a title string — strip tags and decode entities
function cleanTitle(raw: string | undefined): string {
  if (!raw) return "";
  return decodeHtmlEntities(raw)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatRelative(ms: number): string {
  const diffMin = Math.max(1, Math.round((Date.now() - ms) / 60000));
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
}

export async function fetchAllRegionalItems(): Promise<RegionalItem[]> {
  const parser = new Parser({
    timeout: FEED_TIMEOUT_MS,
    headers: { "User-Agent": "FlintPoliceOps-Aggregator/1.0 (+https://flintpoliceops.com)" },
  });

  const rssPromise = Promise.all(
    feedSources.map(async (src) => {
      try {
        const feed = await withTimeout(parser.parseURL(src.url), FEED_TIMEOUT_MS + 1000);
        const items = (feed.items || [])
          .slice(0, MAX_ITEMS_PER_FEED)
          .map((item, idx): RegionalItem | null => {
            const link = item.link?.trim();
            const title = cleanTitle(item.title);
            if (!link || !title) return null;
            const publishedAt = item.isoDate
              ? new Date(item.isoDate).getTime()
              : item.pubDate
              ? new Date(item.pubDate).getTime()
              : Date.now();
            return {
              id: `${src.id}-${idx}-${link}`,
              sourceId: src.id,
              sourceName: src.name,
              county: src.county,
              title,
              link,
              excerpt: cleanExcerpt(item.contentSnippet || item.content || item.summary),
              publishedAt: Number.isFinite(publishedAt) ? publishedAt : Date.now(),
              publishedDisplay: formatRelative(
                Number.isFinite(publishedAt) ? publishedAt : Date.now(),
              ),
            };
          })
          .filter((x): x is RegionalItem => x !== null);
        return items;
      } catch (err) {
        console.warn(`[feeds] failed ${src.id}: ${(err as Error).message}`);
        return [];
      }
    }),
  );

  const [rssResults, scraped] = await Promise.all([rssPromise, fetchGeneseeCountyGovItems()]);
  const all = [...rssResults.flat(), ...scraped];

  // De-dupe by link (some outlets syndicate each other).
  const seen = new Set<string>();
  const deduped: RegionalItem[] = [];
  for (const item of all) {
    const key = item.link.split("?")[0];
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  deduped.sort((a, b) => b.publishedAt - a.publishedAt);
  return deduped;
}
