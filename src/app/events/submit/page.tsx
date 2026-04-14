"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

type Status = "idle" | "parsing" | "submitting" | "success" | "error";

const CATEGORIES = [
  "Arts & Culture",
  "Community",
  "Education",
  "Faith & Spirituality",
  "Food & Drink",
  "Fundraiser / Charity",
  "Government / City Meeting",
  "Health & Wellness",
  "Music & Entertainment",
  "Networking / Business",
  "Parks & Recreation",
  "Sports",
  "Other",
];

interface FormData {
  event_name: string;
  category: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  venue: string;
  address: string;
  city: string;
  website: string;
  ticket_url: string;
  cost: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

const EMPTY: FormData = {
  event_name: "", category: "", description: "",
  start_date: "", start_time: "", end_date: "", end_time: "",
  venue: "", address: "", city: "Flint",
  website: "", ticket_url: "", cost: "",
  contact_name: "", contact_email: "", contact_phone: "",
};

const REQUIRED_FIELDS: (keyof FormData)[] = [
  "event_name", "category", "start_date", "venue", "description",
  "contact_name", "contact_email",
];

const FIELD_LABELS: Record<keyof FormData, string> = {
  event_name: "Event Name", category: "Category", description: "Description",
  start_date: "Start Date", start_time: "Start Time", end_date: "End Date", end_time: "End Time",
  venue: "Venue", address: "Street Address", city: "City",
  website: "Event Website", ticket_url: "Ticket URL", cost: "Cost / Admission",
  contact_name: "Your Name", contact_email: "Email", contact_phone: "Phone",
};

export default function SubmitEventPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [parseUrl, setParseUrl] = useState("");
  const [parseError, setParseError] = useState("");
  const [parsedFields, setParsedFields] = useState<Set<keyof FormData>>(new Set());
  const [showMissing, setShowMissing] = useState(false);
  const [form, setForm] = useState<FormData>({ ...EMPTY });

  const set = useCallback((key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── URL Parser ──────────────────────────────────────────────────────────────
  const handleParse = async () => {
    if (!parseUrl.trim()) { setParseError("Please enter a URL first."); return; }
    setParseError("");
    setStatus("parsing");
    try {
      const res = await fetch("/api/parse-event-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parseUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setParseError(data.error || "Could not parse that URL. Please fill in the details below.");
        setStatus("idle");
        return;
      }
      const ev = data.event as Partial<FormData>;
      const filled = new Set<keyof FormData>();
      setForm((prev) => {
        const next = { ...prev };
        (Object.keys(ev) as (keyof FormData)[]).forEach((k) => {
          if (ev[k] && k in EMPTY) {
            (next as Record<string, string>)[k] = ev[k] as string;
            filled.add(k);
          }
        });
        return next;
      });
      setParsedFields(filled);
      setStatus("idle");
    } catch {
      setParseError("Network error. Please fill in the details manually.");
      setStatus("idle");
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check required fields
    const missing = REQUIRED_FIELDS.filter((f) => !form[f].trim());
    if (missing.length > 0) {
      setShowMissing(true);
      setErrorMessage(`Please fill in: ${missing.map((f) => FIELD_LABELS[f]).join(", ")}`);
      setStatus("error");
      return;
    }
    setShowMissing(false);
    setErrorMessage("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div>
        <section className="text-white" style={{ backgroundColor: "#0f1a2e" }}>
          <div className="max-w-7xl mx-auto px-4 py-10 text-center">
            <h1 className="text-3xl font-black mb-2">Submit a Community Event</h1>
            <p style={{ color: "#8a9ab5" }} className="max-w-xl mx-auto">
              Free listings for Flint &amp; Genesee County events.
            </p>
          </div>
        </section>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "#f0ead6", border: "1px solid #d4c68a" }}>
            <div className="text-5xl mb-3" style={{ color: "#c9a84c" }}>✓</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#0f1a2e" }}>Event Submitted!</h2>
            <p className="mb-6" style={{ color: "#5a5340" }}>
              Your event has been received and will be reviewed by our team. Once approved it will appear on the Flint Police Ops events page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setForm({ ...EMPTY }); setParsedFields(new Set()); setParseUrl(""); setStatus("idle"); }}
                className="inline-block text-white font-semibold px-6 py-3 rounded-lg"
                style={{ backgroundColor: "#c9a84c" }}
              >
                Submit Another Event
              </button>
              <Link href="/events" className="inline-block font-semibold px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50" style={{ color: "#0f1a2e" }}>
                View Events
              </Link>
            </div>
          </div>
        </div>
        <NewsletterSignup variant="banner" />
      </div>
    );
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const submitting = status === "submitting";
  const parsing = status === "parsing";
  const labelStyle = { color: "#0f1a2e" as string };

  const inputClass = (field: keyof FormData, extra = "") => {
    const isMissing = showMissing && REQUIRED_FIELDS.includes(field) && !form[field].trim();
    const isFilled = parsedFields.has(field) && form[field].trim();
    return [
      "w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-60 transition-colors",
      isMissing ? "border-red-400 bg-red-50 focus:ring-red-400" :
      isFilled  ? "border-green-400 bg-green-50 focus:ring-green-400" :
                  "border-gray-300 focus:ring-yellow-500",
      extra,
    ].join(" ");
  };

  const labelClass = (field: keyof FormData) => {
    const isMissing = showMissing && REQUIRED_FIELDS.includes(field) && !form[field].trim();
    return `block text-sm font-semibold mb-1.5 ${isMissing ? "text-red-600" : ""}`;
  };

  return (
    <div>
      <section className="text-white" style={{ backgroundColor: "#0f1a2e" }}>
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-black mb-2">Submit a Community Event</h1>
          <p style={{ color: "#8a9ab5" }} className="max-w-xl mx-auto">
            Free event listings for Flint &amp; Genesee County. Submissions are reviewed before posting.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── URL Parser ── */}
          <div className="rounded-xl p-5 border-2" style={{ backgroundColor: "#f8f5ee", borderColor: "#d4c68a" }}>
            <h2 className="font-bold mb-1" style={{ color: "#0f1a2e" }}>
              🔗 Have a link? Let us fill in the details
            </h2>
            <p className="text-sm mb-3" style={{ color: "#666" }}>
              Paste a Facebook event, Eventbrite, or any event page URL and we&apos;ll try to auto-fill the form below.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={parseUrl}
                onChange={(e) => setParseUrl(e.target.value)}
                placeholder="https://www.facebook.com/events/... or https://eventbrite.com/..."
                disabled={parsing || submitting}
                className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-60"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleParse(); } }}
              />
              <button
                type="button"
                onClick={handleParse}
                disabled={parsing || submitting || !parseUrl.trim()}
                className="px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-colors disabled:opacity-50 whitespace-nowrap"
                style={{ backgroundColor: "#c9a84c" }}
              >
                {parsing ? "Parsing…" : "Parse Event"}
              </button>
            </div>
            {parseError && (
              <p className="text-sm mt-2" style={{ color: "#b91c1c" }}>{parseError}</p>
            )}
            {parsedFields.size > 0 && !parseError && (
              <p className="text-sm mt-2 font-medium" style={{ color: "#15803d" }}>
                ✓ Auto-filled {parsedFields.size} field{parsedFields.size !== 1 ? "s" : ""}. Review below and fill in any missing required fields.
              </p>
            )}
          </div>

          {/* ── Event Details ── */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-4" style={labelStyle}>Event Details</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass("event_name")} style={showMissing && !form.event_name.trim() ? {} : labelStyle}>
                  Event Name <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.event_name}
                  onChange={(e) => set("event_name", e.target.value)}
                  disabled={submitting}
                  className={inputClass("event_name")}
                  placeholder="e.g. Flint Farmers Market Opening Day"
                  maxLength={120}
                />
              </div>

              <div>
                <label className={labelClass("category")} style={showMissing && !form.category.trim() ? {} : labelStyle}>
                  Category <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  disabled={submitting}
                  className={inputClass("category")}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass("description")} style={showMissing && !form.description.trim() ? {} : labelStyle}>
                  Description <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  disabled={submitting}
                  rows={5}
                  className={inputClass("description")}
                  placeholder="Tell us about the event — what it is, who it's for, what to expect."
                  maxLength={1000}
                />
                <p className="text-xs mt-1" style={{ color: "#888" }}>
                  {form.description.length}/1,000 characters
                </p>
              </div>
            </div>
          </div>

          {/* ── Date & Time ── */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-4" style={labelStyle}>Date &amp; Time</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass("start_date")} style={showMissing && !form.start_date.trim() ? {} : labelStyle}>
                  Start Date <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => set("start_date", e.target.value)}
                  disabled={submitting}
                  className={inputClass("start_date")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>Start Time</label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => set("start_time", e.target.value)}
                  disabled={submitting}
                  className={inputClass("start_time")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>End Date</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => set("end_date", e.target.value)}
                  disabled={submitting}
                  className={inputClass("end_date")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>End Time</label>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => set("end_time", e.target.value)}
                  disabled={submitting}
                  className={inputClass("end_time")}
                />
              </div>
            </div>
          </div>

          {/* ── Location ── */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-4" style={labelStyle}>Location</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass("venue")} style={showMissing && !form.venue.trim() ? {} : labelStyle}>
                  Venue / Location Name <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => set("venue", e.target.value)}
                  disabled={submitting}
                  className={inputClass("venue")}
                  placeholder="e.g. Flint Farmers Market, City Hall, Kettering University"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>Street Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  disabled={submitting}
                  className={inputClass("address")}
                  placeholder="e.g. 300 E. Fifth Ave"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  disabled={submitting}
                  className={inputClass("city")}
                  placeholder="e.g. Flint, Burton, Grand Blanc"
                />
              </div>
            </div>
          </div>

          {/* ── Links & Cost ── */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-4" style={labelStyle}>Links &amp; Cost</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>Event Website or Facebook Event URL</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  disabled={submitting}
                  className={inputClass("website")}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>Ticket / Registration URL</label>
                <input
                  type="url"
                  value={form.ticket_url}
                  onChange={(e) => set("ticket_url", e.target.value)}
                  disabled={submitting}
                  className={inputClass("ticket_url")}
                  placeholder="https://... (leave blank if free / no registration)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>Cost / Admission</label>
                <input
                  type="text"
                  value={form.cost}
                  onChange={(e) => set("cost", e.target.value)}
                  disabled={submitting}
                  className={inputClass("cost")}
                  placeholder="e.g. Free, $10, $5–$15, Donations welcome"
                />
              </div>
            </div>
          </div>

          {/* ── Contact Info ── */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-1" style={labelStyle}>Your Contact Info</h2>
            <p className="text-sm mb-4" style={{ color: "#666" }}>
              Not published publicly — only used if we need to follow up about your submission.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass("contact_name")} style={showMissing && !form.contact_name.trim() ? {} : labelStyle}>
                  Name <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.contact_name}
                  onChange={(e) => set("contact_name", e.target.value)}
                  disabled={submitting}
                  className={inputClass("contact_name")}
                />
              </div>
              <div>
                <label className={labelClass("contact_email")} style={showMissing && !form.contact_email.trim() ? {} : labelStyle}>
                  Email <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => set("contact_email", e.target.value)}
                  disabled={submitting}
                  className={inputClass("contact_email")}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>Phone (optional)</label>
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => set("contact_phone", e.target.value)}
                  disabled={submitting}
                  className={inputClass("contact_phone")}
                />
              </div>
            </div>
          </div>

          {status === "error" && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: "#fee", color: "#b91c1c", border: "1px solid #fcc" }}>
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-white font-bold py-3.5 rounded-lg text-base transition-colors disabled:opacity-60"
            style={{ backgroundColor: "#c9a84c" }}
          >
            {submitting ? "Submitting…" : "Submit Event for Review"}
          </button>

          <p className="text-xs text-center" style={{ color: "#666" }}>
            Submissions are reviewed before appearing on the site. Free listings only — no payment required.
          </p>
        </form>
      </div>

      <NewsletterSignup variant="banner" />
    </div>
  );
}
