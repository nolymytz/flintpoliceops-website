import Link from "next/link";
import { events as staticEvents } from "@/data/events";
import EventCard from "@/components/EventCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { fetchUpcomingEvents, type CommunityEvent } from "@/lib/supabase";

export const metadata = {
  title: "Events — Flint Police Ops",
  description: "Upcoming events, community gatherings, and things to do in Flint, Michigan.",
};

export const revalidate = 900; // revalidate every 15 minutes

function formatEventDate(dateStr: string | null): { month: string; day: number } {
  if (!dateStr) return { month: "TBD", day: 0 };
  const d = new Date(dateStr);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.getDate(),
  };
}

function formatEventTime(dateStr: string | null, rawStr: string | null): string {
  if (dateStr) {
    const d = new Date(dateStr);
    // If time is midnight, it's likely a date-only entry
    if (d.getHours() === 0 && d.getMinutes() === 0) {
      return rawStr?.match(/\d+:\d+\s*[ap]m/i)?.[0] ?? "See details";
    }
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return rawStr?.match(/\d+:\d+\s*[ap]m/i)?.[0] ?? "See details";
}

function LiveEventCard({ event }: { event: CommunityEvent }) {
  const { month, day } = formatEventDate(event.start_date);
  const time = formatEventTime(event.start_date, event.start_date_raw);
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
      className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group"
    >
      <div
        className="flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center"
        style={{ backgroundColor: "#f0ead6" }}
      >
        <span className="text-xs font-bold uppercase" style={{ color: "#c9a84c" }}>
          {month}
        </span>
        {day > 0 && (
          <span className="text-gray-900 text-xl font-black leading-none">{day}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-0.5 group-hover:text-blue-700 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-500 text-xs mb-1">
          {time}
          {event.venue ? ` · ${event.venue}` : ""}
        </p>
        {event.description && (
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{event.description}</p>
        )}
        <span
          className="inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: catColor }}
        >
          {event.source}
        </span>
      </div>
    </a>
  );
}

export default async function EventsPage() {
  const liveEvents = await fetchUpcomingEvents(60);
  const hasLive = liveEvents.length > 0;

  // Group live events by category
  const grouped: Record<string, CommunityEvent[]> = {};
  for (const ev of liveEvents) {
    const cat = ev.category ?? "community";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(ev);
  }

  const categoryLabels: Record<string, string> = {
    "arts & culture": "Arts & Culture",
    "community": "Community Events",
    "government": "City & Government",
    "parks & recreation": "Parks & Recreation",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Events in Flint</h1>
          <p className="text-gray-500">
            Community events, meetings, and things to do in Flint &amp; Genesee County.
            {hasLive && (
              <span className="ml-2 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                {liveEvents.length} upcoming
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/events/past"
            className="inline-flex text-gray-700 border border-gray-300 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors hover:bg-gray-50 whitespace-nowrap"
          >
            Past Events
          </Link>
          <Link
            href="/events/submit"
            className="inline-flex text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            style={{ backgroundColor: "#c9a84c" }}
          >
            + Submit an Event
          </Link>
        </div>
      </div>

      {hasLive ? (
        <>
          {Object.entries(grouped).map(([cat, catEvents]) => (
            <div key={cat} className="mb-10">
              <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                {categoryLabels[cat] ?? cat}
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {catEvents.length}
                </span>
              </h2>
              <div className="space-y-3">
                {catEvents.map((ev) => (
                  <LiveEventCard key={ev.source_id} event={ev} />
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {/* Fallback to static events while Supabase populates */}
          <div className="mb-10">
            <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: "#f0ead6", color: "#8a7530" }}
              >
                Featured
              </span>
              This Week&apos;s Highlights
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {staticEvents
                .filter((e) => e.featured)
                .map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg mb-4">All Upcoming Events</h2>
            <div className="space-y-3">
              {staticEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Have an event to share?</h2>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">
          Submit your community event, business opening, fundraiser, or meetup. Featured events reach thousands of Flint residents.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
href="/events/submit"
                className="text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
                style={{ backgroundColor: "#c9a84c" }}
              >
                Submit Free Event
          </Link>
          <Link
            href="/advertise"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Get Featured ($)
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <NewsletterSignup variant="banner" />
      </div>
    </div>
  );
}
