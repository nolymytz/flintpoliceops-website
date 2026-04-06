import Link from "next/link";
import { articles, categoryLabels } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata = {
  title: "Community — Flint Police Ops",
  description: "Community stories, events, and announcements from Flint, Michigan.",
};

export default function CommunityPage() {
  const communityArticles = articles.filter((a) => a.category === "community");
  const categories = ["crime", "local", "community"] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Community</h1>
        <p className="text-gray-500">
          Stories from the people of Flint — events, volunteer efforts,
          businesses, and neighborhood highlights.
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
              cat === "community"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            } transition-colors`}
          >
            {categoryLabels[cat]}
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        {communityArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-10">
        <NewsletterSignup variant="banner" />
      </div>
    </div>
  );
}
