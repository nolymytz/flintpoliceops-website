"use client";

import { useState } from "react";
import NewsletterSignup from "@/components/NewsletterSignup";

const packages = [
  { name: "Spotlight Post", price: "$49", period: "one-time", description: "A sponsored article that looks like a news story — the most effective way to reach Flint residents.", features: ["Custom written article about your business", "Published in our news feed", "Shared to our 10K+ Facebook audience", "Included in daily email newsletter", "Permanent link on the site"], popular: true },
  { name: "Featured Business", price: "$29", period: "/month", description: "Your business featured in our Business Directory with a highlighted listing.", features: ["Top placement in directory", "Business logo + description", "Direct link to your website", "Contact info displayed", "Category page visibility"], popular: false },
  { name: "Newsletter Sponsor", price: "$79", period: "/week", description: "Your business name and message at the top of our daily email newsletter.", features: ["Sponsored by [Your Business] header", "5,000+ daily email subscribers", "7 consecutive days of exposure", "Custom message + link", "Performance report included"], popular: false },
  { name: "Event Feature", price: "$19", period: "one-time", description: "Highlight your event with a featured badge and top placement on our Events page.", features: ["Featured badge on your event", "Top placement on Events page", "Included in weekly events email", "Social media promotion"], popular: false },
];

export default function AdvertisePage() {
  const [formData, setFormData] = useState({ name: "", business: "", email: "", phone: "", package: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div>
      <section className="text-white" style={{ backgroundColor: '#0f1a2e' }}>
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-black mb-3">Put Your Business in Front of Flint</h1>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: '#8a9ab5' }}>Reach thousands of engaged Flint residents every day through sponsored content, featured listings, and newsletter sponsorships.</p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <div className="text-center"><div className="text-3xl font-black" style={{ color: '#c9a84c' }}>10K+</div><div className="text-gray-400">Facebook Followers</div></div>
            <div className="text-center"><div className="text-3xl font-black" style={{ color: '#c9a84c' }}>5K+</div><div className="text-gray-400">Email Subscribers</div></div>
            <div className="text-center"><div className="text-3xl font-black" style={{ color: '#c9a84c' }}>50K+</div><div className="text-gray-400">Monthly Page Views</div></div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-10">Advertising Packages</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.name} className={`bg-white rounded-xl p-6 flex flex-col ${pkg.popular ? "shadow-lg relative" : ""}`}
              style={{ border: pkg.popular ? '2px solid #c9a84c' : '2px solid #e5e7eb' }}>
              {pkg.popular && (<span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#c9a84c' }}>Most Popular</span>)}
              <h3 className="font-bold text-gray-900 text-lg mb-1">{pkg.name}</h3>
              <div className="mb-3"><span className="text-3xl font-black text-gray-900">{pkg.price}</span><span className="text-gray-500 text-sm"> {pkg.period}</span></div>
              <p className="text-gray-500 text-sm mb-4 flex-1">{pkg.description}</p>
              <ul className="space-y-2 mb-6">{pkg.features.map((f) => (<li key={f} className="flex items-start gap-2 text-sm text-gray-700"><span style={{ color: '#c9a84c' }} className="mt-0.5 flex-shrink-0">&#10003;</span>{f}</li>))}</ul>
              <a href="#contact" className={`block text-center font-semibold py-2.5 rounded-lg text-sm transition-colors`}
                style={pkg.popular ? { backgroundColor: '#c9a84c', color: 'white' } : { backgroundColor: '#f3f4f6', color: '#111827' }}>Get Started</a>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-10">Why Advertise With Flint Police Ops?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{n:"1",t:"Hyperlocal Audience",d:"Our audience is 100% Flint and Genesee County residents — the people most likely to become your customers."},{n:"2",t:"Trusted Source",d:"Flint Police Ops is the community's go-to for news. Your business benefits from that trust and credibility."},{n:"3",t:"Content, Not Just Ads",d:"Sponsored posts blend naturally into news content. Your message gets read, not ignored like banner ads."}].map((item) => (
              <div key={item.n} className="text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold" style={{ backgroundColor: '#f0ead6', color: '#c9a84c' }}>{item.n}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.t}</h3>
                <p className="text-gray-500 text-sm">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Ready to Get Started?</h2>
        <p className="text-gray-500 text-center mb-8">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
        {submitted ? (
          <div className="border rounded-xl p-8 text-center" style={{ backgroundColor: '#f0ead6', borderColor: '#d4c68a' }}>
            <div className="text-4xl mb-3" style={{ color: '#c9a84c' }}>&#10003;</div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Message Received!</h3>
            <p className="text-gray-600">Thanks for your interest. We&apos;ll be in touch within 24 hours to discuss your advertising options.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label><input type="text" required value={formData.business} onChange={(e) => setFormData({...formData, business: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Interested In</label>
              <select value={formData.package} onChange={(e) => setFormData({...formData, package: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                <option value="">Select a package...</option>
                {packages.map((pkg) => (<option key={pkg.name} value={pkg.name}>{pkg.name} — {pkg.price} {pkg.period}</option>))}
                <option value="custom">Custom / Not sure yet</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tell us about your business</label>
              <textarea rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="What does your business do? What would you like to promote?" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none" /></div>
            <button type="submit" className="w-full text-white font-bold py-3 rounded-lg text-sm transition-colors" style={{ backgroundColor: '#c9a84c' }}>Send Inquiry</button>
          </form>
        )}
      </section>

      <NewsletterSignup variant="banner" />
    </div>
  );
}
