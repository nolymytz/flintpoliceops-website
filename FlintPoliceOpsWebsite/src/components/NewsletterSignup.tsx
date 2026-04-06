"use client";

import { useState } from "react";

interface Props {
  variant?: "inline" | "banner" | "sidebar";
}

export default function NewsletterSignup({ variant = "banner" }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  if (variant === "sidebar") {
    return (
      <div className="bg-gray-900 text-white rounded-xl p-6">
        <h3 className="font-bold text-lg mb-1">Daily Flint Updates</h3>
        <p className="text-gray-400 text-sm mb-4">
          Get crime alerts, local news &amp; community updates delivered to your
          inbox every morning.
        </p>
        {submitted ? (
          <div className="bg-green-600/20 text-green-400 rounded-lg p-3 text-sm font-medium">
            You&apos;re signed up! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              Subscribe Free
            </button>
          </form>
        )}
        <p className="text-gray-500 text-xs mt-3">
          Join 5,000+ Flint residents. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">
              Get Flint news in your inbox
            </h3>
            <p className="text-gray-500 text-sm">
              Daily updates on crime, local news &amp; events.
            </p>
          </div>
          {submitted ? (
            <span className="text-green-600 font-medium text-sm">
              Signed up!
            </span>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 w-full sm:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 sm:w-56 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Banner (default)
  return (
    <section id="newsletter" className="bg-red-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-14 text-center">
        <h2 className="text-3xl font-black mb-2">
          Stay Connected to Flint
        </h2>
        <p className="text-red-100 mb-6 max-w-lg mx-auto">
          Join 5,000+ Flint residents who get daily crime alerts, local news,
          and community updates delivered straight to their inbox.
        </p>
        {submitted ? (
          <div className="bg-white/20 inline-block rounded-lg px-6 py-3 font-semibold">
            You&apos;re in! Check your inbox for a welcome email.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              Subscribe Free
            </button>
          </form>
        )}
        <p className="text-red-200 text-sm mt-4">
          Free daily newsletter. No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
