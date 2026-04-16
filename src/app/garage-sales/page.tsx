"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

interface GarageSale {
  id: string;
  title: string;
  sale_type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  source_url: string;
  organizer_name: string;
  organizer_phone: string;
  description: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return "";
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: "America/Detroit",
  };
  const startStr = new Date(start).toLocaleDateString("en-US", opts);
  if (!end) return startStr;
  const endStr = new Date(end).toLocaleDateString("en-US", opts);
  return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
}

function isActive(end: string | null): boolean {
  if (!end) return true;
  return new Date(end) >= new Date();
}

function isToday(start: string | null, end: string | null): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (start && new Date(start) <= new Date(today.getTime() + 86400000)) {
    if (!end || new Date(end) >= today) return true;
  }
  return false;
}

function SaleCard({ sale }: { sale: GarageSale }) {
  const active = isActive(sale.end_date);
  const happeningNow = isToday(sale.start_date, sale.end_date);

  return (
    <a
      href={sale.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {sale.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sale.image_url}
            alt={sale.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0f1a2e, #1a3a6e)" }}
          >
            <span className="text-4xl">🏠</span>
          </div>
        )}
        {happeningNow && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
            Happening Now
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {sale.title}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{sale.address ? `${sale.address}, ` : ""}{sale.city}, {sale.state} {sale.zip}</span>
        </div>

        {(sale.start_date || sale.end_date) && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDateRange(sale.start_date, sale.end_date)}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          {sale.organizer_name && (
            <span className="text-xs text-gray-400 truncate">{sale.organizer_name}</span>
          )}
          <span
            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: "#e8f0fe", color: "#1a56db" }}
          >
            EstateSales.net ↗
          </span>
        </div>
      </div>
    </a>
  );
}

export default function GarageSalesPage() {
  const [sales, setSales] = useState<GarageSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON) return;
    fetch(
      `${SUPABASE_URL}/rest/v1/garage_sales?select=*&order=start_date.asc&limit=200`,
      {
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
      }
    )
      .then((r) => r.json())
      .then((data: GarageSale[]) => {
        setSales(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(sales.map((s) => s.city).filter(Boolean))).sort();
    return ["All", ...unique];
  }, [sales]);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      const matchCity = cityFilter === "All" || s.city === cityFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.organizer_name.toLowerCase().includes(q);
      return matchCity && matchSearch;
    });
  }, [sales, cityFilter, search]);

  return (
    <div>
      {/* Header */}
      <section className="text-white" style={{ backgroundColor: "#0f1a2e" }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-black mb-2">Garage &amp; Estate Sales</h1>
          <p style={{ color: "#8a9ab5" }} className="max-w-2xl">
            Upcoming estate and garage sales in Flint, Genesee, Lapeer, Shiawassee, and surrounding
            Mid-Michigan counties. Listings sourced from{" "}
            <a
              href="https://www.estatesales.net"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300 hover:text-white transition-colors"
            >
              EstateSales.net
            </a>
            . Updated daily.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by title, city, or organizer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Cities" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
              {filtered.length} sale{filtered.length !== 1 ? "s" : ""} found
            </span>
            <a
              href="https://www.estatesales.net/MI/Flint/48503"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline transition-colors"
            >
              List your sale on EstateSales.net →
            </a>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <div className="text-4xl mb-4">🏷️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Sales Found</h2>
            <p className="text-gray-500 mb-6">
              {search || cityFilter !== "All"
                ? "Try adjusting your search or city filter."
                : "No upcoming sales in the area right now. Check back soon!"}
            </p>
            <a
              href="https://www.estatesales.net/MI/Flint/48503"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#0f1a2e" }}
            >
              Browse on EstateSales.net →
            </a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((sale) => (
              <SaleCard key={sale.id} sale={sale} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm font-semibold" style={{ color: "#0f1a2e" }}>
            &larr; Back to Flint Police Ops
          </Link>
        </div>
      </div>

      <NewsletterSignup variant="banner" />
    </div>
  );
}
