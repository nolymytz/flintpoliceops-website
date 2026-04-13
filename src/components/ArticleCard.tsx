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
        <div className="h-48 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f1a2e, #1a2744)' }}>
          <div className="text-center px-6">
            <span className={`inline-block ${categoryColors[article.category]} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}>
              {categoryLabels[article.category]}
            </span>
            <h2 className="text-white text-xl font-bold leading-tight">{article.title}</h2>
          </div>
        </div>
        <div className="p-5">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">{timeAgo}</span>
            <Link href={`/news/${article.category}`} className="text-sm font-semibold" style={{ color: '#c9a84c' }}>
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
        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-2" style={{ backgroundColor: '#f0ead6', color: '#8a7530' }}>
          Sponsored
        </span>
      )}
      <div className="flex items-start gap-3 mb-2">
        <span className={`inline-block ${categoryColors[article.category]} text-white text-xs font-bold px-2.5 py-0.5 rounded-full mt-0.5 whitespace-nowrap`}>
          {categoryLabels[article.category]}
        </span>
        <h3 className="font-bold text-gray-900 leading-snug text-base">
          <Link href={`/news/${article.category}`} className="transition-colors" style={{ color: 'inherit' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = '#c9a84c'}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'inherit'}>
            {article.title}
          </Link>
        </h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-3">{article.excerpt}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{article.author} &middot; {timeAgo}</span>
        <Link href={`/news/${article.category}`} className="font-semibold" style={{ color: '#c9a84c' }}>
          Read more &rarr;
        </Link>
      </div>
    </article>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
