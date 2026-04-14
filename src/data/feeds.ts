// RSS feed sources for the Around the Region section.
// Edit this file to add, remove, or re-label feeds. Changes take
// effect on next build / next ISR revalidation.

export type County =
  | "Genesee"
  | "Lapeer"
  | "Shiawassee"
  | "Saginaw"
  | "Regional";

export interface FeedSource {
  id: string;          // stable slug used for keys
  name: string;        // shown on source badge
  url: string;         // RSS / Atom feed URL
  county: County;      // which county tag to show
  homepage?: string;   // optional, for the source badge tooltip
}

export const feedSources: FeedSource[] = [
  // --- Flint / Genesee ---
  {
    id: "mlive-flint",
    name: "MLive Flint",
    url: "https://www.mlive.com/arc/outboundfeeds/rss/category/news/flint/?outputType=xml",
    county: "Genesee",
    homepage: "https://www.mlive.com/flint/",
  },
  {
    id: "flint-beat",
    name: "Flint Beat",
    url: "https://flintbeat.com/feed/",
    county: "Genesee",
    homepage: "https://flintbeat.com",
  },
  {
    id: "east-village-magazine",
    name: "East Village Magazine",
    url: "https://www.eastvillagemagazine.org/feed/",
    county: "Genesee",
    homepage: "https://www.eastvillagemagazine.org",
  },
  {
    id: "abc12",
    name: "ABC12 WJRT",
    url: "https://www.abc12.com/feed/",
    county: "Genesee",
    homepage: "https://www.abc12.com",
  },
  {
    id: "nbc25",
    name: "NBC25 News",
    url: "https://nbc25news.com/feed/",
    county: "Genesee",
    homepage: "https://nbc25news.com",
  },

  // --- Saginaw ---
  {
    id: "mlive-saginaw",
    name: "MLive Saginaw / Bay City",
    url: "https://www.mlive.com/arc/outboundfeeds/rss/category/news/saginaw-bay-city/?outputType=xml",
    county: "Saginaw",
    homepage: "https://www.mlive.com/saginaw-bay-city/",
  },
  {
    id: "wnem",
    name: "WNEM TV5",
    url: "https://www.wnem.com/feed/",
    county: "Saginaw",
    homepage: "https://www.wnem.com",
  },

  // --- Shiawassee ---
  {
    id: "argus-press",
    name: "The Argus-Press",
    url: "https://www.argus-press.com/search/?f=rss&t=article&l=25&s=start_time&sd=desc",
    county: "Shiawassee",
    homepage: "https://www.argus-press.com",
  },
  {
    id: "independent-shia",
    name: "The Independent",
    url: "https://theshiawasseeindependent.com/feed/",
    county: "Shiawassee",
    homepage: "https://theshiawasseeindependent.com",
  },

  // --- Lapeer ---
  {
    id: "county-press",
    name: "The County Press",
    url: "https://www.thecountypress.com/feed/",
    county: "Lapeer",
    homepage: "https://www.thecountypress.com",
  },
  {
    id: "tri-county-times",
    name: "Tri-County Times",
    url: "https://tctimes.com/search/?f=rss&t=article&l=25&s=start_time&sd=desc",
    county: "Lapeer",
    homepage: "https://tctimes.com",
  },

  // --- Regional / Mid-Michigan ---
  {
    id: "michigan-radio",
    name: "Michigan Radio",
    url: "https://www.michiganradio.org/rss.xml",
    county: "Regional",
    homepage: "https://www.michiganradio.org",
  },
  {
    id: "bridge-michigan",
    name: "Bridge Michigan",
    url: "https://www.bridgemi.com/rss.xml",
    county: "Regional",
    homepage: "https://www.bridgemi.com",
  },];
