"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { fetchBusinesses, fetchBusinessCities, type Business } from "@/lib/supabase";

const PAGE_SIZE = 50;

export default function BusinessDirectoryPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Load cities once
  useEffect(() => {
    fetchBusinessCities().then(setCities);
  }, []);

  // Load businesses when filters change
  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchBusinesses({
      search: debouncedSearch || undefined,
      city: cityFilter || undefined,
      limit: PAGE_SIZE,
    });
    setBusinesses(data);
    setTotal(data.length);
    setLoading(false);
  }, [debouncedSearch, cityFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const clearFilters = () => {
    setSearch("");
    setCityFilter("");
  };

  const hasFilters = search || cityFilter;

  return (
    <div style={{ backgroundColor: "#f8f7f4", minHeight: "100vh" }}>
      {/* Header */}
      <section style={{ backgroundColor: "#0f1a2e" }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black mb-1">Flint Business Directory</h1>
              <p style={{ color: "#8a9ab5" }} className="text-sm">
                Flint &amp; Genesee Chamber of Commerce members — {" "}
                <span className="text-white font-semibold">965 local businesses</span>
              </p>
            </div>
            <Link
              href="/advertise"
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: "#c9a84c", color: "#fff" }}
            >
              Get Featured →
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search businesses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: "#fff", border: "1px solid #d1d5db" }}
              />
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 min-w-[160px]"
              style={{ backgroundColor: "#fff", border: "1px solid #d1d5db" }}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "#1a2744", color: "#8a9ab5" }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {loading ? "Loading..." : (
              hasFilters
                ? `${total} result${total !== 1 ? "s" : ""} found`
                : `Showing ${total} of 965 businesses`
            )}
          </p>
          <p className="text-xs text-gray-400">
            Source: Flint &amp; Genesee Chamber of Commerce
          </p>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-600 font-medium">No businesses found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or clear the filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-semibold px-4 py-2 rounded-lg"
              style={{ backgroundColor: "#0f1a2e", color: "#fff" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((biz) => (
              <BusinessCard key={biz.id} biz={biz} />
            ))}
          </div>
        )}

        {/* Load more hint */}
        {!loading && total === PAGE_SIZE && !hasFilters && (
          <p className="text-center text-sm text-gray-400 mt-8">
            Showing first {PAGE_SIZE} results. Use search to find specific businesses.
          </p>
        )}

        {/* CTA */}
        <div
          className="rounded-xl p-8 text-white text-center mt-12"
          style={{ background: "linear-gradient(135deg, #1a2744, #0f1a2e)" }}
        >
          <h2 className="text-2xl font-black mb-2">Own a Business in Flint?</h2>
          <p className="max-w-lg mx-auto mb-6" style={{ color: "#8a9ab5" }}>
            Get your business in front of thousands of local customers.
            Featured listings start at just $29/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/advertise"
              className="text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
              style={{ backgroundColor: "#c9a84c" }}
            >
              Get Featured
            </Link>
            <Link
              href="/submit"
              className="font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
              style={{ backgroundColor: "#1a2744", color: "#8a9ab5" }}
            >
              Submit Free Listing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessCard({ biz }: { biz: Business }) {
  const cityState = [biz.city, biz.state].filter(Boolean).join(", ");
  const streetAddress = biz.address
    ? biz.address.split(",")[0].trim()
    : "";

  return (
    <div
      className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col"
      style={{ border: "1px solid #e5e7eb" }}
    >
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-sm leading-snug">{biz.name}</h3>
          {biz.membership_level && biz.membership_level !== "Standard" && (
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded shrink-0"
              style={{ backgroundColor: "#f0ead6", color: "#8a7530" }}
            >
              {biz.membership_level}
            </span>
          )}
        </div>

        {(streetAddress || cityState) && (
          <p className="text-gray-500 text-xs mb-2 leading-relaxed">
            {streetAddress && <span>{streetAddress}</span>}
            {streetAddress && cityState && <span> · </span>}
            {cityState && <span>{cityState}</span>}
            {biz.zip && <span> {biz.zip}</span>}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: "1px solid #f3f4f6" }}>
        {biz.phone && (
          <a
            href={`tel:${biz.phone.replace(/\D/g, "")}`}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            📞 {biz.phone}
          </a>
        )}
        {biz.member_url && (
          <a
            href={biz.member_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium ml-auto shrink-0"
            style={{ color: "#c9a84c" }}
          >
            Profile →
          </a>
        )}
      </div>
    </div>
  );
}
