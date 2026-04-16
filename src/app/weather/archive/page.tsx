import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import { fetchArchivedNWSAlerts, type WeatherAlert } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // always run fresh — 24h boundary depends on current time

export const metadata = {
  title: "Weather Alert Archive — Flint Police Ops",
  description: "Past weather alerts for Flint, Genesee, Lapeer, and Shiawassee counties from the National Weather Service.",
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

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Detroit",
    });
  } catch {
    return iso.slice(0, 16).replace("T", " ");
  }
}

function AlertRow({ alert }: { alert: WeatherAlert }) {
  const color = severityColor(alert.severity);
  const excerpt = alert.caption
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("📷"))
    .slice(0, 2)
    .join(" ")
    .slice(0, 160);

  return (
    <article className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow flex gap-4 items-start">
      {/* Severity badge column */}
      <div className="flex-shrink-0 pt-0.5">
        <span
          className="inline-block px-2 py-1 rounded text-xs font-bold text-white whitespace-nowrap"
          style={{ backgroundColor: color }}
        >
          {alert.severity ?? "Alert"}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="font-bold text-gray-900 text-sm leading-snug">{alert.event}</h3>
          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {formatDate(alert.created_at)}
          </span>
        </div>
        {alert.area_desc && (
          <p className="text-xs text-gray-500 mt-0.5">{alert.area_desc}</p>
        )}
        {excerpt && (
          <p className="text-sm text-gray-600 mt-1 leading-snug line-clamp-2">{excerpt}</p>
        )}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {alert.onset && (
            <span className="text-xs text-gray-400">Onset: {alert.onset}</span>
          )}
          {alert.expires && (
            <span className="text-xs text-gray-400">Expired: {alert.expires}</span>
          )}
          {alert.nws_url && (
            <a
              href={alert.nws_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              NWS →
            </a>
          )}
        </div>
      </div>

      {/* Thumbnail if available */}
      {alert.card_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={alert.card_image_url}
          alt={alert.event}
          className="flex-shrink-0 w-16 h-16 rounded-lg object-cover hidden sm:block"
        />
      )}
    </article>
  );
}

export default async function WeatherArchivePage() {
  const alerts = await fetchArchivedNWSAlerts(100);

  // Group alerts by date (America/Detroit)
  const grouped: Record<string, WeatherAlert[]> = {};
  for (const alert of alerts) {
    const dateKey = new Date(alert.created_at).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Detroit",
    });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(alert);
  }

  return (
    <div>
      {/* Header */}
      <section className="text-white" style={{ backgroundColor: "#0f1a2e" }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/weather"
              className="text-sm font-semibold text-blue-300 hover:text-white transition-colors"
            >
              ← Current Alerts
            </Link>
          </div>
          <h1 className="text-3xl font-black mb-2">Weather Alert Archive</h1>
          <p style={{ color: "#8a9ab5" }} className="max-w-2xl">
            Past NWS weather alerts for Mid-Michigan older than 24 hours.
            Alerts are sourced directly from the National Weather Service.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {alerts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <div className="text-4xl mb-4">📁</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Archived Alerts Yet</h2>
            <p className="text-gray-500 mb-6">
              Alerts older than 24 hours will appear here automatically.
            </p>
            <Link
              href="/weather"
              className="inline-block px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#0f1a2e" }}
            >
              ← View Current Alerts
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                {alerts.length} archived alert{alerts.length !== 1 ? "s" : ""}
              </span>
              <Link
                href="/weather"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                ← Back to current alerts
              </Link>
            </div>

            <div className="space-y-8">
              {Object.entries(grouped).map(([dateLabel, dayAlerts]) => (
                <div key={dateLabel}>
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">
                    {dateLabel}
                  </h2>
                  <div className="space-y-3">
                    {dayAlerts.map((alert) => (
                      <AlertRow key={alert.alert_id} alert={alert} />
                    ))}
                  </div>
                </div>
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
