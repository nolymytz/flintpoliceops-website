import Link from "next/link";
import { articles, categoryLabels } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata = {
  title: "Crime & Safety — Flint Police Ops",
  description: "Latest crime reports, safety alerts, and police updates from Flint, Michigan.",
};

export default function CrimePage() {
  const crimeArticles = articles.filter((a) => a.category === "crime");
  const categories = ["crime", "local", "community"] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Crime &amp; Safety
        </h1>
        <p className="text-gray-500">
          Police reports, crime alerts, and safety updates from Flint PD and
          Genesee County.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/news"
          className="bg-white text-gray-700 border border-gray-300 text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
        >
          All News
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/news/${cat}`}
            className={`text-sm font-semibold px-4 py-2 rounded-full ${
              cat === "crime"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            } transition-colors`}
          >
            {categoryLabels[cat]}
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        {crimeArticles.length > 0 ? (
          crimeArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">
            No crime reports at this time. Check back soon.
          </p>
        )}
      </div>

      <div className="mt-10">
        <NewsletterSignup variant="banner" />
      </div>
    </div>
  );
}
