import fs from 'fs';
import path from 'path';
import { Article } from './types';

// Storage file path for persistence across dev server reloads
const DATA_DIR = path.join(process.cwd(), '.runtime-cache');
const DATA_FILE = path.join(DATA_DIR, 'articles.json');

interface RuntimeStoreData {
  drafts: Article[];
  published: Article[];
}

function ensureDataFile(): RuntimeStoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial: RuntimeStoreData = { drafts: [], published: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content) as RuntimeStoreData;
  } catch (err) {
    return { drafts: [], published: [] };
  }
}

function saveDataFile(data: RuntimeStoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving runtime store data:', err);
  }
}

export function getServerDrafts(): Article[] {
  const data = ensureDataFile();
  return data.drafts || [];
}

export function getServerPublishedArticles(): Article[] {
  const data = ensureDataFile();
  return data.published || [];
}

export function addServerDraft(article: Article): Article {
  const data = ensureDataFile();
  // Ensure strict draft guarantee
  article.publishedAt = null;
  article.status = 'draft';

  const existingIndex = data.drafts.findIndex((d) => String(d.id) === String(article.id) || d.slug === article.slug);
  if (existingIndex >= 0) {
    data.drafts[existingIndex] = article;
  } else {
    data.drafts.unshift(article);
  }
  saveDataFile(data);
  return article;
}

export function updateServerDraft(id: string | number, updates: Partial<Article>): Article | null {
  const data = ensureDataFile();
  const index = data.drafts.findIndex((d) => String(d.id) === String(id));
  if (index === -1) return null;

  const updated = {
    ...data.drafts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  data.drafts[index] = updated;
  saveDataFile(data);
  return updated;
}

export function deleteServerDraft(id: string | number): boolean {
  const data = ensureDataFile();
  data.drafts = data.drafts.filter((d) => String(d.id) !== String(id));
  saveDataFile(data);
  return true;
}

export function publishServerDraft(id: string | number): Article | null {
  const data = ensureDataFile();
  const index = data.drafts.findIndex((d) => String(d.id) === String(id));
  if (index === -1) return null;

  const targetDraft = data.drafts[index];
  const publishedArticle: Article = {
    ...targetDraft,
    publishedAt: new Date().toISOString(),
    status: 'published',
  };

  // Remove from drafts
  data.drafts.splice(index, 1);

  // Add to published
  data.published.unshift(publishedArticle);
  saveDataFile(data);

  return publishedArticle;
}
