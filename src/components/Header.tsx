"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/news/crime", label: "Crime & Safety" },
  { href: "/events", label: "Events" },
  { href: "/business-directory", label: "Business Directory" },
  { href: "/advertise", label: "Advertise" },
  { href: "/submit", label: "Submit a Tip" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-red-700 text-center text-sm py-1.5 px-4 font-medium">
        Flint&apos;s #1 Source for Local News, Crime Updates &amp; Community Info
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black text-lg">
            FP
          </div>
          <div>
            <div className="text-xl font-black tracking-tight leading-tight">
              FLINT POLICE OPS
            </div>
            <div className="text-xs text-gray-400 tracking-wide">
              FLINT, MICHIGAN
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="#newsletter"
            className="hidden sm:inline-flex bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Subscribe
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-gray-800 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-300 hover:text-white border-b border-gray-800 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#newsletter"
            onClick={() => setMenuOpen(false)}
            className="mt-3 block text-center bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            Subscribe to Newsletter
          </Link>
        </nav>
      )}
    </header>
  );
}
