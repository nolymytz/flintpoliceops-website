import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import { fetchRecentNWSAlerts, type WeatherAlert } from "@/lib/supabase";

export const revalidate = 300; // revalidate every 5 minutes

export const metadata = {
  title: "Weather Alerts — Flint Police Ops",
  description: "Current weather alerts for Flint, Genesee, Lapeer, and Shiawassee counties from the National Weather Service.",
};

const SEVERITY_COLORS: Record<string, string> = {
  Extreme:  "#dc2626",
  Severe:   "#ea580c",
  Moderate: "#d97706",
  Minor:    "#2563eb",
  Unknown:  "#6b7280",
};

function severityColor(severity: string | null): string {
  return SEVERITY_COLORS[severity ?? "Unknown"] ?? "#6b7280";
}

function AlertCard({ alert }: { alert: WeatherAlert }) {
  const color = severityColor(alert.severity);
  const excerpt = alert.caption
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("📷"))
    .slice(0, 4)
    .join(" ")
    .slice(0, 220);

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {alert.card_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={alert.card_image_url}
          alt={alert.title}
          className="w-full aspect-square object-cover"
        />
      ) : (
        <div
          className="w-full aspect-square flex items-center justify-center px-6"
          style={{ background: "linear-gradient(135deg, #0f1a2e, #1a3a6e)" }}
        >
          <div className="text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <p className="text-white font-bold text-lg leading-tight">{alert.event}</p>
            {alert.area_desc && (
              <p className="text-blue-200 text-sm mt-1 leading-snug">{alert.area_desc}</p>
            )}
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="inline-block px-2 py-0.5 rounded text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {alert.severity ?? "Weather Alert"}
          </span>
          {alert.onset && (
            <span className="text-xs text-gray-400">Onset: {alert.onset}</span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">{alert.event}</h3>
        {alert.area_desc && (
          <p className="text-xs text-gray-500 mb-2">{alert.area_desc}</p>
        )}
        {excerpt && (
          <p className="text-sm text-gray-600 leading-snug line-clamp-3">{excerpt}</p>
        )}
        {alert.expires && (
          <p className="text-xs text-gray-400 mt-2">Expires: {alert.expires}</p>
        )}
        {alert.nws_url && (
          <a
            href={alert.nws_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            View on NWS →
          </a>
        )}
      </div>
    </article>
  );
}

export default async function WeatherAlertsPage() {
  const alerts = await fetchRecentNWSAlerts(50);

  return (
    <div>
      {/* Header */}
      <section className="text-white" style={{ backgroundColor: "#0f1a2e" }}>
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-black mb-2">Weather Alerts</h1>
          <p style={{ color: "#8a9ab5" }} className="max-w-2xl mx-auto">
            Active NWS weather alerts for Flint, Genesee, Lapeer, Shiawassee, and surrounding Mid-Michigan counties
            from the last 24 hours. Older alerts are in the{" "}
            <Link href="/weather/archive" className="underline text-blue-300 hover:text-white transition-colors">
              Weather Archive
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {alerts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <div className="text-4xl mb-4">🌤️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Weather Alerts</h2>
            <p className="text-gray-500 mb-6">
              There are currently no weather alerts for the Flint area in the last 24 hours.
              Check back during severe weather events.
            </p>
            <Link
              href="/weather/archive"
              className="inline-block px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#0f1a2e" }}
            >
              View Past Alerts →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {alerts.length} alert{alerts.length !== 1 ? "s" : ""} in the last 24 hours
              </span>
              <Link
                href="/weather/archive"
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline transition-colors"
              >
                View older alerts →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alerts.map((alert) => (
                <AlertCard key={alert.alert_id} alert={alert} />
              ))}
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
