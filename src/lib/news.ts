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
  publishedAt: string | null;
}

type NewsFeed = {
  url: string;
  source: string;
};

const FEEDS: Record<NewsArea, NewsFeed[]> = {
  technology: [
    {
      url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
      source: "BBC Technology",
    },
    {
      url: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en",
      source: "Google News",
    },
  ],
  business: [
    {
      url: "https://feeds.bbci.co.uk/news/business/rss.xml",
      source: "BBC Business",
    },
    {
      url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en",
      source: "Google News",
    },
  ],
  culture: [
    {
      url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
      source: "BBC Culture",
    },
    {
      url: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-US&gl=US&ceid=US:en",
      source: "Google News",
    },
  ],
  science: [
    {
      url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
      source: "BBC Science",
    },
    {
      url: "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-US&gl=US&ceid=US:en",
      source: "Google News",
    },
  ],
  sports: [
    {
      url: "https://feeds.bbci.co.uk/sport/rss.xml",
      source: "BBC Sport",
    },
    {
      url: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-US&gl=US&ceid=US:en",
      source: "Google News",
    },
  ],
  world: [
    {
      url: "https://feeds.bbci.co.uk/news/world/rss.xml",
      source: "BBC World",
    },
    {
      url: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en",
      source: "Google News",
    },
  ],
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

function extractHeadlines(xml: string, limit: number) {
  const headlines: Array<Pick<NewsHeadline, "title" | "publishedAt">> = [];
  const itemPattern = /<item\b[\s\S]*?<\/item>/gi;
  const titlePattern = /<title[^>]*>([\s\S]*?)<\/title>/i;
  const publishedPattern = /<(?:pubDate|published)[^>]*>([\s\S]*?)<\/(?:pubDate|published)>/i;

  for (const match of xml.matchAll(itemPattern)) {
    const titleMatch = match[0].match(titlePattern);
    if (!titleMatch?.[1]) continue;
    const title = decodeXmlEntities(titleMatch[1]).replace(/\s+/g, " ");
    if (!title || headlines.some((headline) => headline.title === title)) {
      continue;
    }

    const publishedMatch = match[0].match(publishedPattern);
    const publishedRaw = publishedMatch?.[1]
      ? decodeXmlEntities(publishedMatch[1])
      : "";
    const publishedDate = publishedRaw ? new Date(publishedRaw) : null;
    headlines.push({
      title: title.slice(0, 160),
      publishedAt:
        publishedDate && !Number.isNaN(publishedDate.getTime())
          ? publishedDate.toISOString()
          : null,
    });
    if (headlines.length >= limit) break;
  }

  return headlines;
}

export function isNewsArea(value: string): value is NewsArea {
  return (NEWS_AREAS as readonly string[]).includes(value);
}

async function fetchFeedHeadlines(
  area: NewsArea,
  feed: NewsFeed,
  limit: number,
  signal?: AbortSignal,
): Promise<NewsHeadline[]> {
  try {
    const response = await fetch(feed.url, {
      signal,
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      // Fresh headlines matter more than an HTTP cache for an explicit
      // generate action. Feed providers still apply their own edge caching.
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(
        `News feed ${feed.source} returned ${response.status} for ${area}.`,
      );
      return [];
    }

    const xml = await response.text();
    return extractHeadlines(xml, limit).map((headline) => ({
      area,
      title: headline.title,
      source: feed.source,
      publishedAt: headline.publishedAt,
    }));
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    console.warn(`Could not load ${area} headlines from ${feed.source}.`, error);
    return [];
  }
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
      const headlineSets = await Promise.all(
        FEEDS[area].map((feed) =>
          fetchFeedHeadlines(area, feed, perArea, options?.signal),
        ),
      );
      const headlines: NewsHeadline[] = [];
      const seen = new Set<string>();

      for (const headline of headlineSets.flat()) {
        const dedupeKey = headline.title.toLocaleLowerCase();
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        headlines.push(headline);
      }

      return headlines
        .toSorted((a, b) => {
          if (!a.publishedAt && !b.publishedAt) return 0;
          if (!a.publishedAt) return 1;
          if (!b.publishedAt) return -1;
          const aTime = new Date(a.publishedAt).getTime();
          const bTime = new Date(b.publishedAt).getTime();
          return bTime - aTime;
        })
        .slice(0, perArea);
    }),
  );

  return results.flat().slice(0, uniqueAreas.length * perArea);
}
