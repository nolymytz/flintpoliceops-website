import Link from "next/link";
import { articles, categoryLabels } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata = {
  title: "News — Flint Police Ops",
  description: "Latest crime updates, local news, and community stories from Flint, Michigan.",
};

export default function NewsPage() {
  const categories = ["crime", "local", "community"] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Flint News</h1>
        <p className="text-gray-500">Crime, local updates, and community stories from Flint &amp; Genesee County.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/news" className="text-white text-sm font-semibold px-4 py-2 rounded-full" style={{ backgroundColor: '#c9a84c' }}>All News</Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/news/${cat}`}
            className="bg-white text-gray-700 border border-gray-300 text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
            {categoryLabels[cat]}
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        {articles.map((article, i) => (
          <div key={article.id}>
            <ArticleCard article={article} />
            {i === 3 && (<div className="my-4"><NewsletterSignup variant="inline" /></div>)}
          </div>
        ))}
      </div>

      <div className="mt-10"><NewsletterSignup variant="banner" /></div>
    </div>
  );
}
