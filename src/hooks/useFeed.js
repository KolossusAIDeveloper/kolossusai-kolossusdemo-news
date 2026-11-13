const RSS_FEEDS = [
  // Technology
  { url: 'https://feeds.feedburner.com/TechCrunch', source: 'TechCrunch', category: 'Technology' },
  { url: 'https://www.wired.com/feed/rss', source: 'Wired', category: 'Technology' },
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', category: 'Technology' },
  // World
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC News', category: 'World' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'NY Times', category: 'World' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera', category: 'World' },
  // Science
  { url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', source: 'NASA', category: 'Science' },
  { url: 'https://www.sciencedaily.com/rss/top/science.xml', source: 'Science Daily', category: 'Science' },
  { url: 'https://feeds.newscientist.com/home', source: 'New Scientist', category: 'Science' },
];

const CORS_PROXY = 'https://api.allorigins.win/get?url=';

function extractImage(item, xmlDoc) {
  // Try media:content
  const mediaContent = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content')[0];
  if (mediaContent) return mediaContent.getAttribute('url');

  // Try media:thumbnail
  const mediaThumbnail = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
  if (mediaThumbnail) return mediaThumbnail.getAttribute('url');

  // Try enclosure
  const enclosure = item.querySelector('enclosure');
  if (enclosure && enclosure.getAttribute('type')?.startsWith('image')) {
    return enclosure.getAttribute('url');
  }

  // Try og:image in description HTML
  const desc = item.querySelector('description')?.textContent || '';
  const imgMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  return null;
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
}

async function fetchFeed(feed) {
  const proxyUrl = CORS_PROXY + encodeURIComponent(feed.url);
  const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const xmlText = data.contents;
  if (!xmlText) throw new Error('Empty response');

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  const items = Array.from(xmlDoc.querySelectorAll('item, entry'));

  return items.slice(0, 15).map(item => {
    const title = item.querySelector('title')?.textContent?.trim() || '';
    const link =
      item.querySelector('link')?.textContent?.trim() ||
      item.querySelector('link')?.getAttribute('href') ||
      '';
    const pubDate =
      item.querySelector('pubDate')?.textContent ||
      item.querySelector('published')?.textContent ||
      item.querySelector('updated')?.textContent ||
      '';
    const description = stripHtml(
      item.querySelector('description')?.textContent ||
      item.querySelector('summary')?.textContent ||
      item.querySelector('content')?.textContent ||
      ''
    );
    const content =
      item.querySelector('content\\:encoded')?.textContent ||
      item.querySelector('content')?.textContent ||
      '';
    const image = extractImage(item, xmlDoc);

    if (!title || !link) return null;

    return {
      id: `${feed.source}-${link}`,
      title,
      link,
      pubDate,
      description,
      content,
      image,
      source: feed.source,
      category: feed.category,
      sources: [feed.source],
    };
  }).filter(Boolean);
}

export async function fetchAllFeeds() {
  const results = await Promise.allSettled(RSS_FEEDS.map(fetchFeed));
  const articles = [];
  results.forEach(r => {
    if (r.status === 'fulfilled') articles.push(...r.value);
  });
  // Sort by date descending
  articles.sort((a, b) => {
    const da = new Date(a.pubDate || 0);
    const db = new Date(b.pubDate || 0);
    return db - da;
  });
  return articles;
}
