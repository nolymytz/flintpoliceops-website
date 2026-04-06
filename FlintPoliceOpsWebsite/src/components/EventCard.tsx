import type { Event } from "@/data/events";

export default function EventCard({ event }: { event: Event }) {
  const date = new Date(event.date + "T00:00:00");
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();

  return (
    <div className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-14 h-14 bg-red-50 rounded-lg flex flex-col items-center justify-center">
        <span className="text-red-600 text-xs font-bold uppercase">
          {month}
        </span>
        <span className="text-gray-900 text-xl font-black leading-none">
          {day}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-0.5">
          {event.title}
        </h3>
        <p className="text-gray-500 text-xs mb-1">
          {event.time} &middot; {event.location}
        </p>
        <p className="text-gray-600 text-xs leading-relaxed">
          {event.description}
        </p>
      </div>
      {event.featured && (
        <span className="flex-shrink-0 self-start bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">
          Featured
        </span>
      )}
    </div>
  );
}
