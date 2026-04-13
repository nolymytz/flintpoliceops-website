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
      <div className="text-white rounded-xl p-6" style={{ backgroundColor: '#0f1a2e' }}>
        <h3 className="font-bold text-lg mb-1">Daily Flint Updates</h3>
        <p className="text-gray-400 text-sm mb-4">
          Get crime alerts, local news &amp; community updates delivered to your inbox every morning.
        </p>
        {submitted ? (
          <div className="rounded-lg p-3 text-sm font-medium" style={{ backgroundColor: 'rgba(201,168,76,0.2)', color: '#c9a84c' }}>
            You&apos;re signed up! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
              className="w-full px-4 py-2.5 rounded-lg border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#1a2744', borderColor: '#253553', focusRingColor: '#c9a84c' }} />
            <button type="submit" className="w-full text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              style={{ backgroundColor: '#c9a84c' }}>
              Subscribe Free
            </button>
          </form>
        )}
        <p className="text-gray-500 text-xs mt-3">Join 5,000+ Flint residents. Unsubscribe anytime.</p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="rounded-xl p-5" style={{ backgroundColor: '#f0ead6', border: '1px solid #d4c68a' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold" style={{ color: '#0f1a2e' }}>Get Flint news in your inbox</h3>
            <p className="text-sm" style={{ color: '#5a5340' }}>Daily updates on crime, local news &amp; events.</p>
          </div>
          {submitted ? (
            <span className="font-medium text-sm" style={{ color: '#c9a84c' }}>Signed up!</span>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                className="flex-1 sm:w-56 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2" style={{ focusRingColor: '#c9a84c' }} />
              <button type="submit" className="text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
                style={{ backgroundColor: '#c9a84c' }}>
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Banner
  return (
    <section id="newsletter" style={{ backgroundColor: '#0f1a2e' }}>
      <div className="max-w-7xl mx-auto px-4 py-14 text-center">
        <h2 className="text-3xl font-black mb-2 text-white">Stay Connected to Flint</h2>
        <p className="mb-6 max-w-lg mx-auto" style={{ color: '#8a9ab5' }}>
          Join 5,000+ Flint residents who get daily crime alerts, local news, and community updates delivered straight to their inbox.
        </p>
        {submitted ? (
          <div className="inline-block rounded-lg px-6 py-3 font-semibold text-white" style={{ backgroundColor: 'rgba(201,168,76,0.2)' }}>
            You&apos;re in! Check your inbox for a welcome email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2" />
            <button type="submit" className="text-white font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              style={{ backgroundColor: '#c9a84c' }}>
              Subscribe Free
            </button>
          </form>
        )}
        <p className="text-sm mt-4" style={{ color: '#5a6a85' }}>Free daily newsletter. No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
