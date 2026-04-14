"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

type Status = "idle" | "submitting" | "success" | "error";

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

export default function SubmitEventPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setErrorMessage("");
    setStatus("submitting");

    try {
      const fd = new FormData(e.currentTarget);
      const body = {
        event_name:   fd.get("event_name"),
        category:     fd.get("category"),
        start_date:   fd.get("start_date"),
        start_time:   fd.get("start_time"),
        end_date:     fd.get("end_date"),
        end_time:     fd.get("end_time"),
        venue:        fd.get("venue"),
        address:      fd.get("address"),
        city:         fd.get("city"),
        description:  fd.get("description"),
        website:      fd.get("website"),
        ticket_url:   fd.get("ticket_url"),
        cost:         fd.get("cost"),
        contact_name: fd.get("contact_name"),
        contact_email:fd.get("contact_email"),
        contact_phone:fd.get("contact_phone"),
      };

      const res = await fetch("/api/submit-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      formRef.current?.reset();
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

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
              Your event has been received and will be reviewed by our team. Once approved it will appear on the Flint Police Ops events page. We&apos;ll reach out if we have questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setStatus("idle")}
                className="inline-block text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: "#c9a84c" }}
              >
                Submit Another Event
              </button>
              <Link
                href="/events"
                className="inline-block font-semibold px-6 py-3 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                style={{ color: "#0f1a2e" }}
              >
                View Events
              </Link>
            </div>
          </div>
        </div>
        <NewsletterSignup variant="banner" />
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-60";
  const labelClass = "block text-sm font-semibold mb-1.5";
  const labelStyle = { color: "#0f1a2e" as string };
  const submitting = status === "submitting";

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
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

          {/* Event Details */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-4" style={labelStyle}>Event Details</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass} style={labelStyle}>
                  Event Name <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  name="event_name"
                  type="text"
                  required
                  disabled={submitting}
                  className={inputClass}
                  placeholder="e.g. Flint Farmers Market Opening Day"
                  maxLength={120}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Category <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <select name="category" required disabled={submitting} className={inputClass}>
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Description <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <textarea
                  name="description"
                  required
                  disabled={submitting}
                  rows={5}
                  className={inputClass}
                  placeholder="Tell us about the event — what it is, who it's for, what to expect."
                  maxLength={1000}
                />
                <p className="text-xs mt-1" style={{ color: "#888" }}>Max 1,000 characters</p>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-4" style={labelStyle}>Date &amp; Time</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>
                  Start Date <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input name="start_date" type="date" required disabled={submitting} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Start Time</label>
                <input name="start_time" type="time" disabled={submitting} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>End Date</label>
                <input name="end_date" type="date" disabled={submitting} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>End Time</label>
                <input name="end_time" type="time" disabled={submitting} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-4" style={labelStyle}>Location</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass} style={labelStyle}>
                  Venue / Location Name <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input
                  name="venue"
                  type="text"
                  required
                  disabled={submitting}
                  className={inputClass}
                  placeholder="e.g. Flint Farmers Market, City Hall, Kettering University"
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Street Address</label>
                <input
                  name="address"
                  type="text"
                  disabled={submitting}
                  className={inputClass}
                  placeholder="e.g. 300 E. Fifth Ave"
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>City</label>
                <input
                  name="city"
                  type="text"
                  disabled={submitting}
                  className={inputClass}
                  placeholder="e.g. Flint, Burton, Grand Blanc"
                  defaultValue="Flint"
                />
              </div>
            </div>
          </div>

          {/* Links & Cost */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-4" style={labelStyle}>Links &amp; Cost</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass} style={labelStyle}>Event Website or Facebook Event URL</label>
                <input
                  name="website"
                  type="url"
                  disabled={submitting}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Ticket / Registration URL</label>
                <input
                  name="ticket_url"
                  type="url"
                  disabled={submitting}
                  className={inputClass}
                  placeholder="https://... (leave blank if free / no registration)"
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Cost / Admission</label>
                <input
                  name="cost"
                  type="text"
                  disabled={submitting}
                  className={inputClass}
                  placeholder="e.g. Free, $10, $5–$15, Donations welcome"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-1" style={labelStyle}>Your Contact Info</h2>
            <p className="text-sm mb-4" style={{ color: "#666" }}>
              Not published publicly — only used if we need to follow up about your submission.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>
                  Name <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input name="contact_name" type="text" required disabled={submitting} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>
                  Email <span style={{ color: "#b91c1c" }}>*</span>
                </label>
                <input name="contact_email" type="email" required disabled={submitting} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} style={labelStyle}>Phone (optional)</label>
                <input name="contact_phone" type="tel" disabled={submitting} className={inputClass} />
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
