import { ActiveEvent } from "@/lib/supabase";

interface Props {
  events: ActiveEvent[];
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function getEventColor(eventType: string): string {
  const lower = eventType.toLowerCase();
  if (lower.includes("fire") || lower.includes("structure")) return "#ea580c";
  if (lower.includes("shooting") || lower.includes("assault") || lower.includes("weapon")) return "#b91c1c";
  if (lower.includes("crash") || lower.includes("accident") || lower.includes("mva")) return "#d97706";
  if (lower.includes("medical") || lower.includes("ems") || lower.includes("cardiac")) return "#0369a1";
  return "#374151";
}

export default function Active911Widget({ events }: Props) {
  if (events.length === 0) return null;

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#b91c1c" }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: "#b91c1c" }}>
        <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
        <h3 className="font-bold text-white text-sm tracking-wide uppercase">Active 911 Events</h3>
      </div>
      <ul className="divide-y divide-gray-100 bg-white">
        {events.map((ev) => (
          <li key={ev.id} className="px-4 py-3">
            <div className="flex items-start gap-2">
              <span
                className="inline-block mt-0.5 px-2 py-0.5 rounded text-white text-xs font-bold whitespace-nowrap"
                style={{ backgroundColor: getEventColor(ev.event_type) }}
              >
                {ev.event_type}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{ev.location}</p>
                {ev.description && (
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{ev.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{formatTime(ev.updated_at)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400">Source: Genesee County 911 · Updates every 5 min</p>
      </div>
    </div>
  );
}
