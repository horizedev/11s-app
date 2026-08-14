export const NEWS_AREAS = [
  "technology",
  "business",
  "culture",
  "science",
  "sports",
  "world",
] as const;

export type NewsArea = (typeof NEWS_AREAS)[number];

export interface NewsHeadline {
  area: NewsArea;
  title: string;
  source: string;
}

const FEEDS: Record<NewsArea, { url: string; source: string }> = {
  technology: {
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    source: "BBC Technology",
  },
  business: {
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    source: "BBC Business",
  },
  culture: {
    url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
    source: "BBC Culture",
  },
  science: {
    url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    source: "BBC Science",
  },
  sports: {
    url: "https://feeds.bbci.co.uk/sport/rss.xml",
    source: "BBC Sport",
  },
  world: {
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    source: "BBC World",
  },
};

function decodeXmlEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

function extractTitles(xml: string, limit: number) {
  const titles: string[] = [];
  const itemPattern = /<item\b[\s\S]*?<\/item>/gi;
  const titlePattern = /<title[^>]*>([\s\S]*?)<\/title>/i;

  for (const match of xml.matchAll(itemPattern)) {
    const titleMatch = match[0].match(titlePattern);
    if (!titleMatch?.[1]) continue;
    const title = decodeXmlEntities(titleMatch[1]).replace(/\s+/g, " ");
    if (!title || titles.includes(title)) continue;
    titles.push(title.slice(0, 160));
    if (titles.length >= limit) break;
  }

  return titles;
}

export function isNewsArea(value: string): value is NewsArea {
  return (NEWS_AREAS as readonly string[]).includes(value);
}

export async function fetchNewsHeadlines(
  areas: NewsArea[],
  options?: { perArea?: number; signal?: AbortSignal },
): Promise<NewsHeadline[]> {
  const uniqueAreas = [...new Set(areas)].filter(isNewsArea);
  if (uniqueAreas.length === 0) return [];

  const perArea = options?.perArea ?? 3;
  const results = await Promise.all(
    uniqueAreas.map(async (area) => {
      const feed = FEEDS[area];
      try {
        const response = await fetch(feed.url, {
          signal: options?.signal,
          headers: { Accept: "application/rss+xml, application/xml, text/xml" },
          next: { revalidate: 1800 },
        });
        if (!response.ok) return [] as NewsHeadline[];
        const xml = await response.text();
        return extractTitles(xml, perArea).map((title) => ({
          area,
          title,
          source: feed.source,
        }));
      } catch {
        return [] as NewsHeadline[];
      }
    }),
  );

  return results.flat().slice(0, uniqueAreas.length * perArea);
}
