import { ScheduledPost, extractTitle, extractExcerpt, formatPostDate } from "@/lib/supabase";

interface Props {
  post: ScheduledPost;
  featured?: boolean;
}

function detectCategory(caption: string): { label: string; color: string } {
  const lower = caption.toLowerCase();
  if (lower.includes("shooting") || lower.includes("homicide") || lower.includes("murder") ||
      lower.includes("arrest") || lower.includes("crime") || lower.includes("police") ||
      lower.includes("robbery") || lower.includes("assault") || lower.includes("stabbing")) {
    return { label: "Crime & Safety", color: "#b91c1c" };
  }
  if (lower.includes("fire") || lower.includes("firefighter") || lower.includes("blaze")) {
    return { label: "Fire", color: "#ea580c" };
  }
  if (lower.includes("weather") || lower.includes("storm") || lower.includes("snow") ||
      lower.includes("warning") || lower.includes("watch") || lower.includes("advisory")) {
    return { label: "Weather", color: "#0369a1" };
  }
  if (lower.includes("road") || lower.includes("construction") || lower.includes("water") ||
      lower.includes("infrastructure") || lower.includes("city council") || lower.includes("mayor")) {
    return { label: "Local News", color: "#0f1a2e" };
  }
  if (lower.includes("school") || lower.includes("community") || lower.includes("event") ||
      lower.includes("volunteer") || lower.includes("youth")) {
    return { label: "Community", color: "#15803d" };
  }
  return { label: "Local News", color: "#0f1a2e" };
}

export default function LivePostCard({ post, featured = false }: Props) {
  const title = extractTitle(post.caption);
  const excerpt = extractExcerpt(post.caption);
  const dateDisplay = formatPostDate(post.scheduled_time);
  const { label, color } = detectCategory(post.caption);
  const hasImage = !!post.image_url;
  const isWeatherCard = post.post_type === "native_photo";

  // For weather alert cards, link to the weather section
  // For regular articles with a source url, link out to the original
  const href = post.url || "/news";
  const isExternal = !!post.url;

  if (featured) {
    return (
      <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url!}
            alt={title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="h-48 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f1a2e, #1a2744)" }}>
            <div className="text-center px-6">
              <span className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ backgroundColor: color }}>
                {label}
              </span>
              <h2 className="text-white text-xl font-bold leading-tight">{title}</h2>
            </div>
          </div>
        )}
        <div className="p-5">
          {hasImage && (
            <span className="inline-block text-white text-xs font-bold px-2.5 py-0.5 rounded-full mb-2" style={{ backgroundColor: color }}>
              {label}
            </span>
          )}
          {hasImage && <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2">{title}</h2>}
          {excerpt && <p className="text-gray-600 text-sm leading-relaxed mb-4">{excerpt}</p>}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">{dateDisplay}</span>
            <a
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener nofollow" : undefined}
              className="text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: "#c9a84c" }}
            >
              {isWeatherCard ? "View Alert →" : "Read more →"}
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-2">
        <span
          className="inline-block text-white text-xs font-bold px-2.5 py-0.5 rounded-full mt-0.5 whitespace-nowrap"
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
        <h3 className="font-bold text-gray-900 leading-snug text-base">
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener nofollow" : undefined}
            className="transition-colors hover:text-yellow-600"
          >
            {title}
          </a>
        </h3>
      </div>
      {excerpt && <p className="text-gray-600 text-sm leading-relaxed mb-3">{excerpt}</p>}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Flint Police Ops &middot; {dateDisplay}</span>
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener nofollow" : undefined}
          className="font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "#c9a84c" }}
        >
          {isWeatherCard ? "View Alert →" : "Read more →"}
        </a>
      </div>
    </article>
  );
}
