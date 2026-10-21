import { Article, Category, Author } from './types';
import { mockArticles, mockCategories, mockAuthors } from './data';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Normalizes Strapi 5 / Strapi 4 item into standard format
 */
function normalizeItem<T>(item: any): T {
  if (!item) return item;
  if (item.attributes) {
    return {
      id: item.id,
      ...item.attributes,
    } as T;
  }
  return item as T;
}

/**
 * Safely fetches data from Strapi with immediate fallback
 */
async function fetchFromStrapi<T>(endpoint: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for fast fallback

    const res = await fetch(`${STRAPI_BASE_URL}/api${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {}),
      },
      next: { revalidate: 30 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    // Strapi offline or unreachable, seamlessly fall back
    return null;
  }
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  const data = await fetchFromStrapi<any[]>('/categories?populate=*');
  if (data && Array.isArray(data) && data.length > 0) {
    return data.map((item) => normalizeItem<Category>(item));
  }
  return mockCategories;
}

/**
 * Fetch category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const data = await fetchFromStrapi<any[]>(`/categories?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
  if (data && Array.isArray(data) && data.length > 0) {
    return normalizeItem<Category>(data[0]);
  }
  const found = mockCategories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  return found || null;
}

/**
 * Fetch all authors
 */
export async function getAuthors(): Promise<Author[]> {
  const data = await fetchFromStrapi<any[]>('/authors?populate=*');
  if (data && Array.isArray(data) && data.length > 0) {
    return data.map((item) => normalizeItem<Author>(item));
  }
  return mockAuthors;
}

/**
 * Fetch author by slug
 */
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const data = await fetchFromStrapi<any[]>(`/authors?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
  if (data && Array.isArray(data) && data.length > 0) {
    return normalizeItem<Author>(data[0]);
  }
  const found = mockAuthors.find((a) => a.slug.toLowerCase() === slug.toLowerCase());
  return found || null;
}

/**
 * Fetch all articles with optional filtering
 */
export async function getArticles(options?: {
  categorySlug?: string;
  authorSlug?: string;
  search?: string;
  tag?: string;
}): Promise<Article[]> {
  const { categorySlug, authorSlug, search, tag } = options || {};

  // Build Strapi query if available
  let queryParams: string[] = ['populate=*', 'sort=publishedAt:desc'];
  if (categorySlug) queryParams.push(`filters[category][slug][$eq]=${encodeURIComponent(categorySlug)}`);
  if (authorSlug) queryParams.push(`filters[author][slug][$eq]=${encodeURIComponent(authorSlug)}`);
  if (search) queryParams.push(`filters[title][$containsi]=${encodeURIComponent(search)}`);

  const data = await fetchFromStrapi<any[]>(`/articles?${queryParams.join('&')}`);
  let articles: Article[] = [];

  if (data && Array.isArray(data) && data.length > 0) {
    articles = data.map((item) => {
      const art = normalizeItem<Article>(item);
      // normalize nested relations if present
      if (art.category) art.category = normalizeItem<Category>(art.category);
      if (art.author) art.author = normalizeItem<Author>(art.author);
      return art;
    });
  } else {
    articles = [...mockArticles];
  }

  // Merge any runtime published articles if on server
  if (typeof window === 'undefined') {
    try {
      const { getServerPublishedArticles } = require('./runtime-store');
      const serverPublished: Article[] = getServerPublishedArticles();
      if (serverPublished && serverPublished.length > 0) {
        // Prepend newer published articles without duplicate slugs
        const existingSlugs = new Set(articles.map((a) => a.slug));
        const newOnes = serverPublished.filter((sp) => !existingSlugs.has(sp.slug));
        articles = [...newOnes, ...articles];
      }
    } catch (e) {
      // ignore
    }
  }

  // Client / fallback filtering
  if (categorySlug) {
    articles = articles.filter(
      (a) => a.category?.slug.toLowerCase() === categorySlug.toLowerCase()
    );
  }

  if (authorSlug) {
    articles = articles.filter(
      (a) => a.author?.slug.toLowerCase() === authorSlug.toLowerCase()
    );
  }

  if (tag) {
    articles = articles.filter((a) =>
      a.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  return articles;
}

/**
 * Fetch single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const data = await fetchFromStrapi<any[]>(`/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
  if (data && Array.isArray(data) && data.length > 0) {
    const art = normalizeItem<Article>(data[0]);
    if (art.category) art.category = normalizeItem<Category>(art.category);
    if (art.author) art.author = normalizeItem<Author>(art.author);
    return art;
  }
  const found = mockArticles.find((a) => a.slug.toLowerCase() === slug.toLowerCase());
  if (found) return found;

  // Check runtime server store (both published and drafts for preview)
  if (typeof window === 'undefined') {
    try {
      const { getServerPublishedArticles, getServerDrafts } = require('./runtime-store');
      const published = getServerPublishedArticles();
      const matchPub = published.find((a: Article) => a.slug.toLowerCase() === slug.toLowerCase());
      if (matchPub) return matchPub;

      const drafts = getServerDrafts();
      const matchDraft = drafts.find((a: Article) => a.slug.toLowerCase() === slug.toLowerCase());
      if (matchDraft) return matchDraft;
    } catch (e) {
      // ignore
    }
  }

  return null;
}

/**
 * Fetch featured articles
 */
export async function getFeaturedArticles(): Promise<Article[]> {
  const all = await getArticles();
  const featured = all.filter((a) => a.featured);
  return featured.length > 0 ? featured : all.slice(0, 2);
}

/**
 * Fetch related articles
 */
export async function getRelatedArticles(currentSlug: string, categorySlug?: string): Promise<Article[]> {
  const all = await getArticles();
  return all
    .filter((a) => a.slug !== currentSlug && (!categorySlug || a.category?.slug === categorySlug))
    .slice(0, 3);
}
