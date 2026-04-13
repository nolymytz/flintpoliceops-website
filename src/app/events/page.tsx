import Link from "next/link";
import { events } from "@/data/events";
import EventCard from "@/components/EventCard";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata = {
  title: "Events — Flint Police Ops",
  description: "Upcoming events, community gatherings, and things to do in Flint, Michigan.",
};

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Events in Flint</h1>
          <p className="text-gray-500">Community events, meetings, and things to do in Flint &amp; Genesee County.</p>
        </div>
        <Link href="/submit" className="inline-flex text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap" style={{ backgroundColor: '#c9a84c' }}>
          + Submit an Event
        </Link>
      </div>

      <div className="mb-10">
        <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#f0ead6', color: '#8a7530' }}>Featured</span>
          This Week&apos;s Highlights
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {events.filter((e) => e.featured).map((event) => (<EventCard key={event.id} event={event} />))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-gray-900 text-lg mb-4">All Upcoming Events</h2>
        <div className="space-y-3">
          {events.map((event) => (<EventCard key={event.id} event={event} />))}
        </div>
      </div>

      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Have an event to share?</h2>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">Submit your community event, business opening, fundraiser, or meetup. Featured events reach thousands of Flint residents.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/submit" className="text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors" style={{ backgroundColor: '#c9a84c' }}>Submit Free Event</Link>
          <Link href="/advertise" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">Get Featured ($)</Link>
        </div>
      </div>

      <div className="mt-10"><NewsletterSignup variant="banner" /></div>
    </div>
  );
}
