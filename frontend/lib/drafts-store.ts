import { Article } from './types';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const DRAFTS_LOCAL_KEY = 'lumina_press_drafts_v1';
const PUBLISHED_LOCAL_KEY = 'lumina_press_user_published_v1';

/**
 * Helper to get local drafts from browser localStorage
 */
export function getLocalDrafts(): Article[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DRAFTS_LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read local drafts:', e);
    return [];
  }
}

/**
 * Helper to save local drafts to browser localStorage
 */
export function saveLocalDrafts(drafts: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DRAFTS_LOCAL_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.error('Failed to save local drafts:', e);
  }
}

/**
 * Helper to get user-published articles from browser localStorage
 */
export function getLocalPublished(): Article[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PUBLISHED_LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read local published articles:', e);
    return [];
  }
}

/**
 * Helper to save user-published articles to browser localStorage
 */
export function saveLocalPublished(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PUBLISHED_LOCAL_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Failed to save local published articles:', e);
  }
}

/**
 * Creates a new Draft article.
 * Guarantees publishedAt is null!
 */
export async function createDraftArticle(articleData: Omit<Article, 'id'>): Promise<Article> {
  const newId = `draft-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const draftArticle: Article = {
    ...articleData,
    id: newId,
    publishedAt: null, // STRICTLY DRAFT
    status: 'draft',
    createdAt: new Date().toISOString(),
  };

  // Try to persist to Strapi backend if reachable
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const payload = {
      data: {
        title: draftArticle.title,
        slug: draftArticle.slug,
        excerpt: draftArticle.excerpt,
        content: draftArticle.content,
        coverImage: draftArticle.coverImage,
        readingTime: draftArticle.readingTime,
        featured: draftArticle.featured || false,
        tags: draftArticle.tags,
        // Relations in Strapi
        category: typeof draftArticle.category.id === 'number' ? draftArticle.category.id : undefined,
        author: typeof draftArticle.author.id === 'number' ? draftArticle.author.id : undefined,
        publishedAt: null, // Strapi draft
      },
    };

    const res = await fetch(`${STRAPI_BASE_URL}/api/articles`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        draftArticle.id = json.data.id || newId;
        draftArticle.documentId = json.data.documentId;
      }
    }
  } catch (err) {
    // Strapi offline or unreachable, will save to local store
    console.info('Strapi offline or unavailable, saving draft to local store.');
  }

  // Always keep in local drafts store for instant offline review & UI responsiveness
  const existing = getLocalDrafts();
  saveLocalDrafts([draftArticle, ...existing]);

  return draftArticle;
}

/**
 * Updates an existing draft (during review / editing)
 */
export async function updateDraftArticle(id: string | number, updates: Partial<Article>): Promise<Article | null> {
  const existing = getLocalDrafts();
  const index = existing.findIndex((d) => String(d.id) === String(id) || d.slug === updates.slug);

  if (index === -1) return null;

  const updated: Article = {
    ...existing[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  existing[index] = updated;
  saveLocalDrafts(existing);

  // If connected to Strapi and has documentId or id
  if (updated.documentId || typeof updated.id === 'number') {
    try {
      const target = updated.documentId || updated.id;
      await fetch(`${STRAPI_BASE_URL}/api/articles/${target}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            title: updated.title,
            slug: updated.slug,
            excerpt: updated.excerpt,
            content: updated.content,
            coverImage: updated.coverImage,
            readingTime: updated.readingTime,
            tags: updated.tags,
            category: typeof updated.category.id === 'number' ? updated.category.id : undefined,
            author: typeof updated.author.id === 'number' ? updated.author.id : undefined,
          },
        }),
      });
    } catch (e) {
      // ignore strapi update failure
    }
  }

  return updated;
}

/**
 * Publishes an approved draft to the live blog!
 * Sets publishedAt = timestamp, removes from drafts queue, moves to published.
 */
export async function publishDraftArticle(id: string | number): Promise<Article | null> {
  const drafts = getLocalDrafts();
  const draftIndex = drafts.findIndex((d) => String(d.id) === String(id));

  if (draftIndex === -1) return null;

  const targetDraft = drafts[draftIndex];
  const publishedDate = new Date().toISOString();

  const publishedArticle: Article = {
    ...targetDraft,
    publishedAt: publishedDate,
    status: 'published',
  };

  // Try to publish in Strapi backend
  try {
    const target = targetDraft.documentId || targetDraft.id;
    // In Strapi 5, we can update publishedAt or use the document service
    await fetch(`${STRAPI_BASE_URL}/api/articles/${target}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        data: {
          publishedAt: publishedDate,
        },
      }),
    });
  } catch (err) {
    console.info('Strapi offline, published locally.');
  }

  // Remove from drafts
  drafts.splice(draftIndex, 1);
  saveLocalDrafts(drafts);

  // Add to published local store
  const published = getLocalPublished();
  saveLocalPublished([publishedArticle, ...published]);

  return publishedArticle;
}

/**
 * Deletes a draft
 */
export async function deleteDraftArticle(id: string | number): Promise<boolean> {
  const drafts = getLocalDrafts();
  const filtered = drafts.filter((d) => String(d.id) !== String(id));
  saveLocalDrafts(filtered);

  try {
    await fetch(`${STRAPI_BASE_URL}/api/articles/${id}`, {
      method: 'DELETE',
    });
  } catch (e) {
    // ignore
  }

  return true;
}
