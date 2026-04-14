import Link from "next/link";
import { fetchAllRegionalItems } from "@/lib/feeds";
import NewsletterSignup from "@/components/NewsletterSignup";

// Re-fetch feeds every 15 minutes. ISR: first request after the window
// triggers a background refresh; subsequent requests see the new data.
export const revalidate = 900;

export const metadata = {
  title: "Around the Region — Flint Police Ops",
  description: "Headlines from across Flint, Genesee, Lapeer, Shiawassee, and Saginaw counties — pulled live from local news outlets.",
};

const COUNTY_COLORS: Record<string, string> = {
  Genesee: "#0f1a2e",
  Saginaw: "#8b3a3a",
  Lapeer: "#2d5a3d",
  Shiawassee: "#6b4c8a",
  Regional: "#5a5340",
};

export default async function RegionalNewsPage() {
  const items = await fetchAllRegionalItems();
  const counties = ["Genesee", "Saginaw", "Lapeer", "Shiawassee", "Regional"] as const;

  return (
    <div>
      <section className="text-white" style={{ backgroundColor: '#0f1a2e' }}>
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-black mb-2">Around the Region</h1>
          <p style={{ color: '#8a9ab5' }} className="max-w-2xl mx-auto">
            Live headlines from across Flint, Genesee, Lapeer, Shiawassee, and Saginaw counties. All links open the original story on the source&apos;s website.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {items.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            Feeds are warming up. Check back in a minute.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                {items.length} stories &middot; updated live
              </span>
            </div>

            {counties.map((county) => {
              const countyItems = items.filter((i) => i.county === county).slice(0, 15);
              if (countyItems.length === 0) return null;
              return (
                <section key={county} className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="inline-block w-1 h-6 rounded"
                      style={{ backgroundColor: COUNTY_COLORS[county] }}
                    />
                    <h2 className="text-xl font-bold" style={{ color: '#0f1a2e' }}>
                      {county === "Regional" ? "Mid-Michigan & Statewide" : `${county} County`}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {countyItems.map((item) => (
                      <li key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-400 transition-colors">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener nofollow"
                          className="block"
                        >
                          <div className="flex items-center gap-2 mb-1 text-xs">
                            <span
                              className="inline-block px-2 py-0.5 rounded text-white font-semibold"
                              style={{ backgroundColor: COUNTY_COLORS[item.county] }}
                            >
                              {item.sourceName}
                            </span>
                            <span style={{ color: '#888' }}>{item.publishedDisplay}</span>
                          </div>
                          <h3 className="font-bold text-base leading-snug mb-1" style={{ color: '#0f1a2e' }}>
                            {item.title}
                          </h3>
                          {item.excerpt && (
                            <p className="text-sm leading-snug" style={{ color: '#555' }}>
                              {item.excerpt}
                            </p>
                          )}
                          <span className="text-xs font-semibold mt-2 inline-block" style={{ color: '#c9a84c' }}>
                            Read on {item.sourceName} &rarr;
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </>
        )}

        <div className="mt-10 text-center">
          <Link href="/news" className="text-sm font-semibold" style={{ color: '#0f1a2e' }}>
            &larr; Back to Flint Police Ops news
          </Link>
        </div>
      </div>

      <NewsletterSignup variant="banner" />
    </div>
  );
}
