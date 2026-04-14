import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import EventsClient from "@/components/EventsClient";
import { fetchUpcomingEvents } from "@/lib/supabase";

export const metadata = {
  title: "Events — Flint Police Ops",
  description: "Upcoming events, community gatherings, and things to do in Flint, Michigan.",
};

export const revalidate = 900; // revalidate every 15 minutes

export default async function EventsPage() {
  const liveEvents = await fetchUpcomingEvents(100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Events in Flint</h1>
          <p className="text-gray-500">
            Community events, meetings, and things to do in Flint &amp; Genesee County.
            {liveEvents.length > 0 && (
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

      {/* Filter pills + event list (client component) */}
      <EventsClient events={liveEvents} />

      {/* Submit CTA */}
      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Have an event to share?</h2>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">
          Submit your community event, business opening, fundraiser, or meetup. Featured events
          reach thousands of Flint residents.
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
