"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// Desktop nav — simplified labels, 7 items
const navLinks = [
  { href: "/news", label: "News" },
  { href: "/weather", label: "Weather Alerts" },
  { href: "/events", label: "Events" },
  { href: "/business-directory", label: "Local Business" },
  { href: "/garage-sales", label: "Garage Sales" },
  { href: "/advertise", label: "Contact" },
];

// Mobile drawer — full list with all sub-pages
const drawerLinks = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/news/crime", label: "Crime & Safety" },
  { href: "/news/regional", label: "Around the Region" },
  { href: "/weather", label: "Weather Alerts" },
  { href: "/events", label: "Events" },
  { href: "/business-directory", label: "Business Directory" },
  { href: "/garage-sales", label: "Garage & Estate Sales" },
  { href: "/advertise", label: "Advertise" },
  { href: "/submit", label: "Submit a Tip" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#0f1a2e' }}>
        {/* Top bar */}
        <div className="text-center text-sm py-1.5 px-4 font-medium text-white" style={{ backgroundColor: '#c9a84c' }}>
          Flint&apos;s #1 Source for Local News, Crime Updates &amp; Community Info
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Mobile hamburger — LEFT side */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-2 text-gray-300 hover:text-white mr-2"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-1 lg:flex-none">
            <Image
              src="/images/fpo-logo.png"
              alt="FPO Logo"
              width={44}
              height={44}
              className="rounded-lg"
            />
            <div className="whitespace-nowrap">
              <div className="text-xl font-black tracking-tight leading-tight text-white whitespace-nowrap">
                FLINT POLICE OPS
              </div>
              <div className="text-xs tracking-wide whitespace-nowrap" style={{ color: '#c9a84c' }}>
                FLINT, MICHIGAN
              </div>
            </div>
          </Link>

          {/* Desktop nav + Subscribe */}
          <nav className="hidden lg:flex items-center gap-0 flex-nowrap overflow-hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 py-2 text-xs font-medium text-gray-300 hover:text-white rounded-lg transition-colors whitespace-nowrap"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a2744'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#newsletter"
              className="ml-2 inline-flex text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              style={{ backgroundColor: '#c9a84c' }}
            >
              Subscribe
            </Link>
          </nav>
        </div>
      </header>

      {/* Left-side drawer overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer panel — slides in from left */}
          <nav
            className="relative w-72 max-w-[85vw] h-full flex flex-col overflow-y-auto"
            style={{ backgroundColor: '#0f1a2e', boxShadow: '4px 0 24px rgba(0,0,0,0.5)' }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1a2744' }}>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/fpo-logo.png"
                  alt="FPO Logo"
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
                <div>
                  <div className="text-sm font-black tracking-tight text-white">FLINT POLICE OPS</div>
                  <div className="text-xs" style={{ color: '#c9a84c' }}>FLINT, MICHIGAN</div>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 px-3 py-4 space-y-1">
              {drawerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a2744'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Subscribe CTA at bottom */}
            <div className="px-5 py-5" style={{ borderTop: '1px solid #1a2744' }}>
              <Link
                href="#newsletter"
                onClick={() => setMenuOpen(false)}
                className="block text-center text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: '#c9a84c' }}
              >
                Subscribe to Newsletter
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
