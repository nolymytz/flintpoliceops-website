import Link from "next/link";
import { Article, categoryLabels, categoryColors } from "@/data/articles";

interface Props {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: Props) {
  const timeAgo = getTimeAgo(article.date);

  if (featured) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-48 flex items-center justify-center">
          <div className="text-center px-6">
            <span
              className={`inline-block ${categoryColors[article.category]} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}
            >
              {categoryLabels[article.category]}
            </span>
            <h2 className="text-white text-xl font-bold leading-tight">
              {article.title}
            </h2>
          </div>
        </div>
        <div className="p-5">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">{timeAgo}</span>
            <Link
              href={`/news/${article.category}`}
              className="text-red-600 hover:text-red-700 text-sm font-semibold"
            >
              Read more &rarr;
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {article.sponsored && (
        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded mb-2">
          Sponsored
        </span>
      )}
      <div className="flex items-start gap-3 mb-2">
        <span
          className={`inline-block ${categoryColors[article.category]} text-white text-xs font-bold px-2.5 py-0.5 rounded-full mt-0.5 whitespace-nowrap`}
        >
          {categoryLabels[article.category]}
        </span>
        <h3 className="font-bold text-gray-900 leading-snug text-base">
          <Link
            href={`/news/${article.category}`}
            className="hover:text-red-600 transition-colors"
          >
            {article.title}
          </Link>
        </h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-3">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {article.author} &middot; {timeAgo}
        </span>
        <Link
          href={`/news/${article.category}`}
          className="text-red-600 hover:text-red-700 font-semibold"
        >
          Read more &rarr;
        </Link>
      </div>
    </article>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
