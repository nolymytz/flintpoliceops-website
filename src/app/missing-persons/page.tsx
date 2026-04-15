import { fetchMissingPersons } from "@/lib/supabase";
import type { MissingPerson } from "@/lib/supabase";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Michigan Missing Persons — Flint Police Ops",
  description:
    "Current missing persons cases in Michigan sourced from the National Center for Missing & Exploited Children (NCMEC). If you have information, call 1-800-THE-LOST.",
};

export const revalidate = 3600; // refresh every hour

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Unknown";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function PersonCard({ person }: { person: MissingPerson }) {
  const name = [person.first_name, person.middle_name, person.last_name]
    .filter(Boolean)
    .join(" ");
  const location = [person.missing_city, person.missing_county ? `${person.missing_county} Co.` : null, person.missing_state]
    .filter(Boolean)
    .join(", ");

  const imgSrc = person.image_url || person.thumbnail_url;

  return (
    <a
      href={person.ncmec_url ?? `https://www.missingkids.org/gethelpnow/search`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 bg-white"
    >
      {/* Photo */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={`Photo of ${name}`}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        {/* Case type badge */}
        {person.case_type && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-red-600 text-white uppercase tracking-wide shadow">
            {person.case_type}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="font-bold text-sm text-gray-900 leading-tight group-hover:text-red-700 transition-colors">
          {name}
        </div>
        {person.age !== null && (
          <div className="text-xs text-gray-600">Age: <span className="font-semibold">{person.age}</span></div>
        )}
        {location && (
          <div className="text-xs text-gray-500 truncate">Last seen: {location}</div>
        )}
        {person.missing_date && (
          <div className="text-xs text-gray-400 mt-auto pt-1">{formatDate(person.missing_date)}</div>
        )}
      </div>
    </a>
  );
}

export default async function MissingPersonsPage() {
  const persons = await fetchMissingPersons();

  // Group by county for filtering display
  const geneseePersons = persons.filter(
    (p) => p.missing_county?.toLowerCase().includes("genesee") ||
           p.missing_city?.toLowerCase().includes("flint") ||
           p.missing_city?.toLowerCase().includes("burton") ||
           p.missing_city?.toLowerCase().includes("davison") ||
           p.missing_city?.toLowerCase().includes("flushing") ||
           p.missing_city?.toLowerCase().includes("swartz creek")
  );
  const otherPersons = persons.filter((p) => !geneseePersons.includes(p));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Header banner */}
      <div style={{ backgroundColor: "#0f1a2e" }} className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔍</span>
            <h1 className="text-3xl font-black text-white tracking-tight">Michigan Missing Persons</h1>
          </div>
          <p className="text-gray-300 text-sm max-w-2xl">
            Active missing persons cases in Michigan sourced from the{" "}
            <a href="https://www.missingkids.org" target="_blank" rel="noopener noreferrer"
              className="underline text-yellow-400 hover:text-yellow-300">
              National Center for Missing &amp; Exploited Children (NCMEC)
            </a>
            . Updated hourly.
          </p>
          {/* Emergency tip line */}
          <div className="mt-4 inline-flex items-center gap-3 bg-red-700 text-white px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-bold text-sm">
              Have information? Call <a href="tel:18008435678" className="underline">1-800-THE-LOST (1-800-843-5678)</a>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {persons.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-semibold">No active cases found.</p>
            <p className="text-sm mt-1">Check back soon — data is refreshed hourly from NCMEC.</p>
          </div>
        ) : (
          <>
            {/* Stats bar */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-black text-red-600">{persons.length}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Active Cases</div>
              </div>
              {geneseePersons.length > 0 && (
                <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-red-200 text-center">
                  <div className="text-2xl font-black text-red-700">{geneseePersons.length}</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Genesee County</div>
                </div>
              )}
              <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-black text-gray-700">{otherPersons.length}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Rest of Michigan</div>
              </div>
            </div>

            {/* Genesee County section */}
            {geneseePersons.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-6 rounded-full bg-red-600 inline-block"></span>
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Genesee County &amp; Flint Area</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {geneseePersons.map((p) => (
                    <PersonCard key={p.case_number} person={p} />
                  ))}
                </div>
              </section>
            )}

            {/* Rest of Michigan */}
            {otherPersons.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-6 rounded-full bg-gray-400 inline-block"></span>
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Rest of Michigan</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {otherPersons.map((p) => (
                    <PersonCard key={p.case_number} person={p} />
                  ))}
                </div>
              </section>
            )}

            {/* NCMEC attribution */}
            <div className="mt-10 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
              Data sourced from the{" "}
              <a href="https://www.missingkids.org" target="_blank" rel="noopener noreferrer"
                className="underline hover:text-gray-600">
                National Center for Missing &amp; Exploited Children
              </a>
              . If you have information about any of these individuals, please call{" "}
              <a href="tel:18008435678" className="underline font-semibold text-red-600">
                1-800-THE-LOST
              </a>{" "}
              or contact your local law enforcement immediately.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
