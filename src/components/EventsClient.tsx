"use client";

import { useState, useMemo } from "react";
import type { CommunityEvent } from "@/lib/supabase";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatEventDate(dateStr: string | null): { month: string; day: number } {
  if (!dateStr) return { month: "TBD", day: 0 };
  const d = new Date(dateStr);
  return {
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    day: d.getUTCDate(),
  };
}

function formatEventTime(dateStr: string | null, rawStr: string | null): string {
  if (dateStr) {
    const d = new Date(dateStr);
    if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) {
      return rawStr?.match(/\d+:\d+\s*[ap]m/i)?.[0] ?? "See details";
    }
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return rawStr?.match(/\d+:\d+\s*[ap]m/i)?.[0] ?? "See details";
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; pill: string }> = {
  "arts & culture":    { bg: "#f3eeff", text: "#6d28d9", pill: "#7c3aed" },
  "community":         { bg: "#eff6ff", text: "#1d4ed8", pill: "#2563eb" },
  "government":        { bg: "#fef2f2", text: "#b91c1c", pill: "#dc2626" },
  "parks & recreation":{ bg: "#f0fdf4", text: "#15803d", pill: "#16a34a" },
  "sports":            { bg: "#fff7ed", text: "#c2410c", pill: "#ea580c" },
  "food & drink":      { bg: "#fefce8", text: "#a16207", pill: "#ca8a04" },
  "festival":          { bg: "#fdf4ff", text: "#a21caf", pill: "#c026d3" },
  "education":         { bg: "#f0fdfa", text: "#0f766e", pill: "#0d9488" },
};

function getCatStyle(cat: string | null) {
  return CATEGORY_COLORS[(cat ?? "community").toLowerCase()] ?? CATEGORY_COLORS["community"];
}

const CATEGORY_LABELS: Record<string, string> = {
  "arts & culture":     "Arts & Culture",
  "community":          "Community",
  "government":         "Government",
  "parks & recreation": "Parks & Rec",
  "sports":             "Sports",
  "food & drink":       "Food & Drink",
  "festival":           "Festivals",
  "education":          "Education",
};

// ── Event Card ────────────────────────────────────────────────────────────────

function LiveEventCard({ event }: { event: CommunityEvent }) {
  const { month, day } = formatEventDate(event.start_date);
  const time = formatEventTime(event.start_date, event.start_date_raw);
  const style = getCatStyle(event.category);

  return (
    <a
      href={event.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all group"
    >
      {/* Date badge */}
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-0.5 group-hover:text-blue-700 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-500 text-xs mb-1.5 truncate">
          {time}
          {event.venue ? ` · ${event.venue}` : ""}
        </p>
        {event.description && (
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-1.5">
            {event.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {event.category && (
            <span
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              {CATEGORY_LABELS[(event.category).toLowerCase()] ?? event.category}
            </span>
          )}
          <span className="inline-block text-xs text-gray-400 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
            {event.source}
          </span>
        </div>
      </div>
    </a>
  );
}

// ── Main Client Component ─────────────────────────────────────────────────────

interface EventsClientProps {
  events: CommunityEvent[];
}

export default function EventsClient({ events }: EventsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Build sorted unique category list from actual events
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ev of events) {
      const cat = (ev.category ?? "community").toLowerCase();
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // sort by count desc
      .map(([cat, count]) => ({ cat, count, label: CATEGORY_LABELS[cat] ?? cat }));
  }, [events]);

  // Filtered + sorted event list
  const filtered = useMemo(() => {
    const list = activeCategory
      ? events.filter((ev) => (ev.category ?? "community").toLowerCase() === activeCategory)
      : events;
    return [...list].sort((a, b) => {
      if (!a.start_date) return 1;
      if (!b.start_date) return -1;
      return a.start_date.localeCompare(b.start_date);
    });
  }, [events, activeCategory]);

  if (events.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        No upcoming events found. Check back soon!
      </p>
    );
  }

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all ${
            activeCategory === null
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
        >
          All
          <span className={`ml-1.5 text-xs ${activeCategory === null ? "text-gray-300" : "text-gray-400"}`}>
            {events.length}
          </span>
        </button>

        {categories.map(({ cat, count, label }) => {
          const style = getCatStyle(cat);
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              className="text-sm font-semibold px-4 py-1.5 rounded-full border transition-all"
              style={
                isActive
                  ? { backgroundColor: style.pill, color: "#fff", borderColor: style.pill }
                  : { backgroundColor: "#fff", color: "#374151", borderColor: "#e5e7eb" }
              }
            >
              {label}
              <span
                className="ml-1.5 text-xs"
                style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#9ca3af" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Event list */}
      <div className="space-y-3">
        {filtered.map((ev) => (
          <LiveEventCard key={ev.source_id} event={ev} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-8">
          No events in this category right now.
        </p>
      )}
    </div>
  );
}
