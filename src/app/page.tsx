import Link from "next/link";
import { events } from "@/data/events";
import EventCard from "@/components/EventCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import LivePostCard from "@/components/LivePostCard";
import Active911Widget from "@/components/Active911Widget";
import { fetchPostedArticles, fetchUpcomingPosts, fetchActiveEvents, type ScheduledPost } from "@/lib/supabase";
import { articles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function Home() {
  // Fetch live data from Supabase — fall back gracefully if env vars not set
  let livePosts: ScheduledPost[] = [];
  let activeEvents: Awaited<ReturnType<typeof fetchActiveEvents>> = [];

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (hasSupabase) {
    // Fetch fired posts first; if none exist yet, also include upcoming scheduled posts
    const [fired, upcoming, events] = await Promise.all([
      fetchPostedArticles(20),
      fetchUpcomingPosts(20),
      fetchActiveEvents(8),
    ]);
    // Merge: show fired posts first, then fill with upcoming if needed
    const combined = [...fired];
    for (const p of upcoming) {
      if (!combined.find((x) => x.id === p.id)) combined.push(p);
    }
    livePosts = combined.slice(0, 20);
    activeEvents = events;
  }

  const useLive = livePosts.length > 0;
  const featuredPosts = useLive ? livePosts.slice(0, 2) : null;
  const recentPosts = useLive ? livePosts.slice(2) : null;

  // Static fallback
  const featuredArticles = articles.filter((a) => a.featured);
  const recentArticles = articles.filter((a) => !a.featured);
  const upcomingEvents = events.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#0f1a2e" }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-6">
            <span
              className="text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse"
              style={{ backgroundColor: "#c9a84c" }}
            >
              LATEST
            </span>
            <span className="text-gray-400 text-sm">
              Updated{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {useLive && featuredPosts
              ? featuredPosts.map((post) => (
                  <LivePostCard key={post.id} post={post} featured />
                ))
              : featuredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} featured />
                ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* News Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Latest News</h2>
              <Link
                href="/news"
                className="text-sm font-semibold"
                style={{ color: "#c9a84c" }}
              >
                View all &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {useLive && recentPosts
                ? recentPosts.slice(0, 3).map((post) => (
                    <LivePostCard key={post.id} post={post} />
                  ))
                : recentArticles.slice(0, 3).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
            </div>

            <div className="my-6">
              <NewsletterSignup variant="inline" />
            </div>

            <div className="space-y-4">
              {useLive && recentPosts
                ? recentPosts.slice(3).map((post) => (
                    <LivePostCard key={post.id} post={post} />
                  ))
                : recentArticles.slice(3).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <NewsletterSignup variant="sidebar" />

            {/* Active 911 Events — only shown when live data available */}
            {activeEvents.length > 0 && (
              <Active911Widget events={activeEvents} />
            )}

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Upcoming Events</h3>
                <Link
                  href="/events"
                  className="text-xs font-semibold"
                  style={{ color: "#c9a84c" }}
                >
                  View all &rarr;
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>

            {/* Advertise CTA */}
            <div
              className="rounded-xl p-6 text-white"
              style={{ background: "linear-gradient(135deg, #1a2744, #0f1a2e)" }}
            >
              <h3 className="font-bold text-lg mb-2">Put Your Business in the Spotlight</h3>
              <p className="text-sm mb-4" style={{ color: "#8a9ab5" }}>
                Reach thousands of Flint residents every day. Featured listings, sponsored posts,
                and newsletter ads available.
              </p>
              <Link
                href="/advertise"
                className="inline-block font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
                style={{ backgroundColor: "#c9a84c", color: "#0f1a2e" }}
              >
                Advertise With Us
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/submit"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span style={{ color: "#c9a84c" }}>&#9654;</span> Submit a News Tip
                  </Link>
                </li>
                <li>
                  <Link
                    href="/submit"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span style={{ color: "#c9a84c" }}>&#9654;</span> Submit an Event
                  </Link>
                </li>
                <li>
                  <Link
                    href="/business-directory"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span style={{ color: "#c9a84c" }}>&#9654;</span> Business Directory
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news/crime"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span style={{ color: "#c9a84c" }}>&#9654;</span> Crime &amp; Safety Reports
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news/regional"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span style={{ color: "#c9a84c" }}>&#9654;</span> Around the Region
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <NewsletterSignup variant="banner" />
    </>
  );
}
