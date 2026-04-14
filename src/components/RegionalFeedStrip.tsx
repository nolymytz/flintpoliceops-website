import Link from "next/link";
import { fetchAllRegionalItems } from "@/lib/feeds";

export default async function RegionalFeedStrip() {
  let items: Awaited<ReturnType<typeof fetchAllRegionalItems>> = [];
  try {
    items = (await fetchAllRegionalItems()).slice(0, 6);
  } catch {
    return null;
  }
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#0f1a2e' }}>Around the Region</h2>
          <p className="text-sm" style={{ color: '#666' }}>
            Latest from local outlets across Flint, Genesee, Lapeer, Shiawassee &amp; Saginaw.
          </p>
        </div>
        <Link href="/news/regional" className="text-sm font-semibold" style={{ color: '#c9a84c' }}>
          See all &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener nofollow"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-400 transition-colors block"
          >
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span
                className="inline-block px-2 py-0.5 rounded text-white font-semibold"
                style={{ backgroundColor: '#0f1a2e' }}
              >
                {item.sourceName}
              </span>
              <span style={{ color: '#888' }}>{item.publishedDisplay}</span>
            </div>
            <h3 className="font-bold text-sm leading-snug" style={{ color: '#0f1a2e' }}>
              {item.title}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}
