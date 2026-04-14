import Link from "next/link";
import { fetchPastEvents, type CommunityEvent } from "@/lib/supabase";

export const metadata = {
  title: "Past Events — Flint Police Ops",
  description: "Archive of past community events in Flint and Genesee County, Michigan.",
};

export const revalidate = 3600; // revalidate every hour

function formatEventDate(dateStr: string | null, rawStr: string | null): string {
  if (dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  return rawStr ?? "Date unknown";
}

function PastEventRow({ event }: { event: CommunityEvent }) {
  const dateLabel = formatEventDate(event.start_date, event.start_date_raw);
  const categoryColors: Record<string, string> = {
    "arts & culture": "#7c3aed",
    "community": "#2563eb",
    "government": "#dc2626",
    "parks & recreation": "#16a34a",
  };
  const catColor = categoryColors[event.category ?? "community"] ?? "#2563eb";

  return (
    <a
      href={event.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group opacity-80 hover:opacity-100"
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center bg-gray-100">
        <span className="text-xs font-bold uppercase text-gray-400">
          {event.start_date
            ? new Date(event.start_date).toLocaleDateString("en-US", { month: "short" })
            : "—"}
        </span>
        {event.start_date && (
          <span className="text-gray-500 text-xl font-black leading-none">
            {new Date(event.start_date).getDate()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-700 text-sm leading-snug mb-0.5 group-hover:text-blue-700 transition-colors line-through decoration-gray-300">
          {event.title}
        </h3>
        <p className="text-gray-400 text-xs mb-1 no-underline" style={{ textDecoration: "none" }}>
          {dateLabel}
          {event.venue ? ` · ${event.venue}` : ""}
        </p>
        {event.description && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-1 no-underline" style={{ textDecoration: "none" }}>
            {event.description}
          </p>
        )}
        <span
          className="inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: catColor, opacity: 0.7 }}
        >
          {event.source}
        </span>
      </div>
    </a>
  );
}

export default async function PastEventsPage() {
  const pastEvents = await fetchPastEvents(100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/events" className="text-sm text-blue-600 hover:underline">
              ← Upcoming Events
            </Link>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Past Events</h1>
          <p className="text-gray-500">
            Archive of community events in Flint &amp; Genesee County.
            {pastEvents.length > 0 && (
              <span className="ml-2 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {pastEvents.length} events
              </span>
            )}
          </p>
        </div>
        <Link
          href="/events"
          className="inline-flex text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          style={{ backgroundColor: "#c9a84c" }}
        >
          View Upcoming Events
        </Link>
      </div>

      {pastEvents.length > 0 ? (
        <div className="space-y-3">
          {pastEvents.map((ev) => (
            <PastEventRow key={ev.source_id} event={ev} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-semibold mb-2">No past events yet</p>
          <p className="text-sm">Events will appear here once they&apos;ve passed.</p>
          <Link
            href="/events"
            className="inline-block mt-6 text-sm font-semibold text-blue-600 hover:underline"
          >
            View upcoming events →
          </Link>
        </div>
      )}
    </div>
  );
}
