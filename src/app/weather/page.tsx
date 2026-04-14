import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import { fetchWeatherAlerts, extractTitle, extractExcerpt, formatPostDate } from "@/lib/supabase";

export const revalidate = 300;

export const metadata = {
  title: "Weather Alerts — Flint Police Ops",
  description: "Current and recent weather alerts for Flint, Genesee, Lapeer, and Shiawassee counties from the National Weather Service.",
};

export default async function WeatherAlertsPage() {
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const alerts = hasSupabase ? await fetchWeatherAlerts(12) : [];

  return (
    <div>
      {/* Header */}
      <section className="text-white" style={{ backgroundColor: "#0f1a2e" }}>
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-black mb-2">Weather Alerts</h1>
          <p style={{ color: "#8a9ab5" }} className="max-w-2xl mx-auto">
            Current and recent NWS weather alerts for Flint, Genesee, Lapeer, and Shiawassee counties.
            All alerts sourced directly from the National Weather Service.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {alerts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <div className="text-4xl mb-4">🌤️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Weather Alerts</h2>
            <p className="text-gray-500">
              There are currently no weather alerts for the Flint area.
              Check back during severe weather events.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {alerts.length} recent alert{alerts.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alerts.map((alert) => {
                const title = extractTitle(alert.caption);
                const excerpt = extractExcerpt(alert.caption, 200);
                const dateDisplay = formatPostDate(alert.scheduled_time);

                return (
                  <article
                    key={alert.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {alert.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={alert.image_url}
                        alt={title}
                        className="w-full aspect-square object-cover"
                      />
                    ) : (
                      <div
                        className="w-full aspect-square flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #0f1a2e, #1a3a6e)" }}
                      >
                        <div className="text-center px-6">
                          <div className="text-5xl mb-3">⚠️</div>
                          <p className="text-white font-bold text-lg leading-tight">{title}</p>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: "#0369a1" }}>
                          Weather Alert
                        </span>
                        <span className="text-xs text-gray-400">{dateDisplay}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{title}</h3>
                      {excerpt && (
                        <p className="text-sm text-gray-600 leading-snug">{excerpt}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm font-semibold" style={{ color: "#0f1a2e" }}>
            &larr; Back to Flint Police Ops
          </Link>
        </div>
      </div>

      <NewsletterSignup variant="banner" />
    </div>
  );
}
