"use client";

import Link from "next/link";
import Image from "next/image";
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
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#0f1a2e' }}>
      {/* Top bar */}
      <div className="text-center text-sm py-1.5 px-4 font-medium text-white" style={{ backgroundColor: '#c9a84c' }}>
        Flint&apos;s #1 Source for Local News, Crime Updates &amp; Community Info
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/fpo-logo.png"
            alt="FPO Logo"
            width={44}
            height={44}
            className="rounded-lg"
          />
          <div>
            <div className="text-xl font-black tracking-tight leading-tight text-white">
              FLINT POLICE OPS
            </div>
            <div className="text-xs tracking-wide" style={{ color: '#c9a84c' }}>
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
              className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-colors"
              style={{ ['--tw-hover-bg' as string]: '#1a2744' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a2744'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="#newsletter"
            className="hidden sm:inline-flex text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#c9a84c' }}
          >
            Subscribe
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="lg:hidden px-4 pb-4" style={{ borderTop: '1px solid #1a2744' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-300 hover:text-white"
              style={{ borderBottom: '1px solid #1a2744' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#newsletter"
            onClick={() => setMenuOpen(false)}
            className="mt-3 block text-center text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            style={{ backgroundColor: '#c9a84c' }}
          >
            Subscribe to Newsletter
          </Link>
        </nav>
      )}
    </header>
  );
}
