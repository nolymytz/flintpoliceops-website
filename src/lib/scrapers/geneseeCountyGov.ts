// Scraper for Genesee County government news.
// They don't publish an RSS feed, so we parse their static news list page
// and produce RegionalItem[] that match the RSS pipeline shape.

import type { RegionalItem } from "@/lib/feeds";

const SOURCE_ID = "genesee-county-gov";
const SOURCE_NAME = "Genesee County Gov";
const NEWS_LIST_URL = "https://www.geneseecountymi.gov/newslist.php";
const BASE_URL = "https://www.geneseecountymi.gov/";
const TIMEOUT_MS = 5000;
const MAX_ITEMS = 8;

// Matches one news card on the list page. The structure is:
//   <div class="news clearfix"> ... <div class="news-date"> Apr 13, 2026 </div>
//     ... <a href="news_detail_T13_R208.php"> <h3 class="news-title">...</h3> </a>
//   </div>
const NEWS_BLOCK_RE =
  /<div class="news clearfix">[\s\S]*?<div class="news-date">\s*([^<]+?)\s*<\/div>[\s\S]*?<a href="(news_detail_[A-Z0-9_]+\.php)"[^>]*>\s*<h3 class="news-title">\s*([^<]+?)\s*<\/h3>/g;

function parseDate(dateStr: string): number {
  // e.g. "Apr 13, 2026" — JS Date can parse this reliably.
  const ms = new Date(dateStr).getTime();
  return Number.isFinite(ms) ? ms : Date.now();
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

export async function fetchGeneseeCountyGovItems(): Promise<RegionalItem[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(NEWS_LIST_URL, {
      headers: {
        "User-Agent": "FlintPoliceOps-Aggregator/1.0 (+https://flintpoliceops.com)",
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`status ${res.status}`);
    const html = await res.text();

    const items: RegionalItem[] = [];
    const seen = new Set<string>();
    let match: RegExpExecArray | null;
    NEWS_BLOCK_RE.lastIndex = 0;
    while ((match = NEWS_BLOCK_RE.exec(html)) !== null) {
      const [, dateStr, href, rawTitle] = match;
      const link = BASE_URL + href;
      if (seen.has(link)) continue;
      seen.add(link);

      const title = rawTitle
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim();
      if (!title) continue;

      const publishedAt = parseDate(dateStr);
      items.push({
        id: `${SOURCE_ID}-${items.length}-${href}`,
        sourceId: SOURCE_ID,
        sourceName: SOURCE_NAME,
        county: "Genesee",
        title,
        link,
        // The list page gives no excerpt; we leave it empty and show just the headline.
        excerpt: "",
        publishedAt,
        publishedDisplay: formatRelative(publishedAt),
      });

      if (items.length >= MAX_ITEMS) break;
    }

    return items;
  } catch (err) {
    console.warn(`[feeds] failed ${SOURCE_ID}: ${(err as Error).message}`);
    return [];
  }
}
