import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Only create the client if both env vars are present.
// Pages guard against missing vars with the hasSupabase check.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ── Types matching the autoposter Supabase schema ─────────────────────────────

export interface ScheduledPost {
  id: number;
  title: string;
  caption: string;
  image_url: string | null;
  url: string | null;
  post_type: string;
  weather_card_photo_id: string | null;
  scheduled_time: string;
  fired: boolean;
  fired_at: string | null;
  queued_at: string;
  source?: string;
  category?: string;
  alert_id?: string | null;
  fb_post_url?: string | null;
}

export interface ActiveEvent {
  id: number;
  event_type: string;
  location: string;
  description: string | null;
  units: string | null;
  created_at: string;
  updated_at: string;
  active: boolean;
}

// ── Data fetchers ─────────────────────────────────────────────────────────────

/**
 * Fetch the most recent posted articles (native posts from approved articles).
 * These are posts that have already been published to Facebook.
 */
export async function fetchPostedArticles(limit = 20): Promise<ScheduledPost[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("fired", true)
    .order("scheduled_time", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[supabase] fetchPostedArticles error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetch upcoming scheduled posts (approved but not yet posted).
 */
export async function fetchUpcomingPosts(limit = 10): Promise<ScheduledPost[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("fired", false)
    .order("scheduled_time", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[supabase] fetchUpcomingPosts error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetch recent weather alert posts (native_photo type with a weather card).
 */
export async function fetchWeatherAlerts(limit = 6): Promise<ScheduledPost[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("post_type", "native_photo")
    .not("weather_card_photo_id", "is", null)
    .order("scheduled_time", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[supabase] fetchWeatherAlerts error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetch active 911 events.
 */
export async function fetchActiveEvents(limit = 10): Promise<ActiveEvent[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("active_events")
    .select("*")
    .eq("active", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[supabase] fetchActiveEvents error:", error.message);
    return [];
  }
  return data ?? [];
}

export interface WeatherAlert {
  id: number;
  alert_id: string;
  event: string;
  title: string;
  area_desc: string | null;
  severity: string | null;
  onset: string | null;
  expires: string | null;
  description: string | null;
  instruction: string | null;
  caption: string;
  card_image_url: string | null;
  nws_url: string | null;
  active: boolean;
  created_at: string;
}

/**
 * Fetch recent NWS weather alerts from the dedicated weather_alerts table.
 * @deprecated Use fetchRecentNWSAlerts or fetchArchivedNWSAlerts instead.
 */
export async function fetchNWSAlerts(limit = 12): Promise<WeatherAlert[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("weather_alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[supabase] fetchNWSAlerts error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetch NWS weather alerts created within the last 24 hours (active/current feed).
 */
export async function fetchRecentNWSAlerts(limit = 50): Promise<WeatherAlert[]> {
  if (!supabase) return [];
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("weather_alerts")
    .select("*")
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[supabase] fetchRecentNWSAlerts error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetch NWS weather alerts older than 24 hours (archive page).
 */
export async function fetchArchivedNWSAlerts(limit = 50): Promise<WeatherAlert[]> {
  if (!supabase) return [];
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("weather_alerts")
    .select("*")
    .lt("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[supabase] fetchArchivedNWSAlerts error:", error.message);
    return [];
  }
  return data ?? [];
}

export interface CommunityEvent {
  id: number;
  source_id: string;
  source: string;
  title: string;
  description: string | null;
  venue: string | null;
  start_date: string | null;
  start_date_raw: string | null;
  url: string | null;
  image_url: string | null;
  category: string | null;
  last_seen: string;
  stale: boolean;
}

/**
 * Fetch upcoming community events (start_date >= today, not stale).
 */
export async function fetchUpcomingEvents(limit = 50): Promise<CommunityEvent[]> {
  if (!supabase) return [];
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("stale", false)
    .gte("start_date", today)
    .order("start_date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[supabase] fetchUpcomingEvents error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetch past community events (start_date < today).
 */
export async function fetchPastEvents(limit = 50): Promise<CommunityEvent[]> {
  if (!supabase) return [];
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .lt("start_date", today)
    .order("start_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[supabase] fetchPastEvents error:", error.message);
    return [];
  }
  return data ?? [];
}

// ── Missing Persons ──────────────────────────────────────────────────────────
export interface MissingPerson {
  id: number;
  case_number: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  age: number | null;
  missing_city: string | null;
  missing_county: string | null;
  missing_state: string;
  missing_date: string | null;
  thumbnail_url: string | null;
  image_url: string | null;
  has_poster: boolean;
  case_type: string | null;
  race: string | null;
  source: string;
  ncmec_url: string | null;
  active: boolean;
  last_updated: string;
}

export async function fetchMissingPersons(): Promise<MissingPerson[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("missing_persons")
    .select("*")
    .eq("active", true)
    .order("missing_date", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("[supabase] fetchMissingPersons error:", error.message);
    return [];
  }
  return data ?? [];
}

// ── Business Directory ──────────────────────────────────────────────────────
export interface Business {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  website: string | null;
  category: string | null;
  member_url: string | null;
  membership_level: string | null;
  source: string | null;
  active: boolean;
  status: string | null;
  created_at: string;
}

/**
 * Fetch all active businesses from the directory.
 * Supports optional search and city filter.
 */
export async function fetchBusinesses(opts?: {
  search?: string;
  city?: string;
  limit?: number;
  offset?: number;
}): Promise<Business[]> {
  if (!supabase) return [];
  let query = supabase
    .from("businesses")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });

  if (opts?.search) {
    query = query.ilike("name", `%${opts.search}%`);
  }
  if (opts?.city) {
    query = query.ilike("city", `%${opts.city}%`);
  }
  if (opts?.limit) {
    query = query.limit(opts.limit);
  }
  if (opts?.offset) {
    query = query.range(opts.offset, (opts.offset ?? 0) + (opts.limit ?? 50) - 1);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[supabase] fetchBusinesses error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetch distinct cities from the businesses table for filter dropdown.
 */
export async function fetchBusinessCities(): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("businesses")
    .select("city")
    .eq("active", true)
    .not("city", "is", null)
    .order("city", { ascending: true });
  if (error) return [];
  const cities = [...new Set((data ?? []).map((r) => r.city).filter(Boolean))] as string[];
  return cities;
}

/**
 * Extract a clean title from a post caption.
 * The caption may start with the article title on the first line,
 * or contain a rewritten article body. Returns the first non-empty line.
 */
export function extractTitle(caption: string): string {
  const lines = caption.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines[0]?.slice(0, 120) ?? "Local News Update";
}

/**
 * Extract a short excerpt from a post caption (skip the first line/title).
 */
export function extractExcerpt(caption: string, maxChars = 180): string {
  const lines = caption.split("\n").map((l) => l.trim()).filter(Boolean);
  // Skip first line (title) and hashtag lines
  const body = lines
    .slice(1)
    .filter((l) => !l.startsWith("#") && !l.startsWith("📷"))
    .join(" ");
  if (!body) return "";
  if (body.length <= maxChars) return body;
  return body.slice(0, maxChars - 1).trimEnd() + "…";
}

/**
 * Format a date string for display.
 */
export function formatPostDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
