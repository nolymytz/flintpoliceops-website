"use client";

import { useState } from "react";
import NewsletterSignup from "@/components/NewsletterSignup";

type SubmitType = "tip" | "event" | "announcement";

export default function SubmitPage() {
  const [type, setType] = useState<SubmitType>("tip");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    details: "",
    location: "",
    date: "",
    time: "",
    anonymous: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const tabs: { key: SubmitType; label: string; desc: string }[] = [
    {
      key: "tip",
      label: "News Tip",
      desc: "Saw something happening? Report it here and our team will look into it.",
    },
    {
      key: "event",
      label: "Submit Event",
      desc: "Share a community event, fundraiser, meeting, or business opening.",
    },
    {
      key: "announcement",
      label: "Announcement",
      desc: "Post a community announcement, lost & found, or neighborhood alert.",
    },
  ];

  const currentTab = tabs.find((t) => t.key === type)!;

  return (
    <div>
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-black mb-2">Submit to Flint Police Ops</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            This is YOUR community platform. Submit news tips, events, and
            announcements to keep Flint informed.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setType(tab.key);
                setSubmitted(false);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                type === tab.key
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-sm mb-6">{currentTab.desc}</p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-green-600 text-4xl mb-3">&#10003;</div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">
              Submission Received!
            </h3>
            <p className="text-gray-600 mb-4">
              Thanks for contributing to the Flint community. Our team will
              review your submission and follow up if needed.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  title: "",
                  details: "",
                  location: "",
                  date: "",
                  time: "",
                  anonymous: false,
                });
              }}
              className="text-red-600 hover:text-red-700 font-semibold text-sm"
            >
              Submit another &rarr;
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-5"
          >
            {type === "tip" && (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) =>
                    setFormData({ ...formData, anonymous: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                Submit anonymously
              </label>
            )}

            {!formData.anonymous && (
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {type === "tip"
                  ? "What happened?"
                  : type === "event"
                    ? "Event Name"
                    : "Announcement Title"}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={
                  type === "tip"
                    ? "Brief description of what you saw or heard"
                    : type === "event"
                      ? "e.g., Spring Community Cleanup"
                      : "e.g., Lost dog in North Flint"
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {(type === "event" || type === "tip") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Address or intersection"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            )}

            {type === "event" && (
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    placeholder="e.g., 10:00 AM – 2:00 PM"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
                rows={5}
                required
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                placeholder={
                  type === "tip"
                    ? "Give us as much detail as possible — what, when, where, who was involved..."
                    : type === "event"
                      ? "Describe the event, who it's for, and any other relevant details..."
                      : "Describe your announcement..."
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm transition-colors"
            >
              Submit {currentTab.label}
            </button>

            <p className="text-gray-400 text-xs text-center">
              All submissions are reviewed by our team before publishing.
              {type === "tip" &&
                " Tips can be submitted anonymously — we protect our sources."}
            </p>
          </form>
        )}
      </div>

      <NewsletterSignup variant="banner" />
    </div>
  );
}
