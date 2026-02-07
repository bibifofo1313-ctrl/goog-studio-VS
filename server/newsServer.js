import http from 'node:http';
import { URL } from 'node:url';

const PORT = Number.parseInt(process.env.PORT ?? '8787', 10);
const API_KEY = process.env.GNEWS_API_KEY;

if (!API_KEY) {
  throw new Error('Missing GNEWS_API_KEY in process.env. Set it before starting the server.');
}

const CACHE_TTL_MS = 10 * 60 * 1000;
let cachedArticles = null;
let cacheExpiresAt = 0;
let inFlight = null;

const buildGnewsUrl = () => {
  const url = new URL('https://gnews.io/api/v4/search');
  url.searchParams.set('q', 'sustainability business regulation');
  url.searchParams.set('lang', 'en');
  url.searchParams.set('max', '3');
  url.searchParams.set('token', API_KEY);
  return url.toString();
};

const normalizeArticles = (articles) =>
  articles.map((article) => ({
    title: article?.title ?? '',
    description: article?.description ?? '',
    url: article?.url ?? '',
    source: { name: article?.source?.name ?? 'GNews' },
    publishedAt: article?.publishedAt ?? new Date().toISOString(),
  }));

const fetchFromGnews = async () => {
  const response = await fetch(buildGnewsUrl());
  if (!response.ok) {
    throw new Error(`GNews API error: ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data?.articles)) {
    throw new Error('GNews API response missing articles array');
  }
  return normalizeArticles(data.articles);
};

const getArticles = async () => {
  const now = Date.now();
  if (cachedArticles && now < cacheExpiresAt) {
    return cachedArticles;
  }
  if (!inFlight) {
    inFlight = fetchFromGnews()
      .then((articles) => {
        cachedArticles = articles;
        cacheExpiresAt = Date.now() + CACHE_TTL_MS;
        return articles;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/news') {
    try {
      const articles = await getArticles();
      sendJson(res, 200, { articles });
    } catch (error) {
      console.error('Failed to fetch GNews articles:', error);
      sendJson(res, 500, { error: 'Failed to fetch news' });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`News API server listening on http://localhost:${PORT}`);
});