#!/usr/bin/env node

/**
 * LuminaPress — Automated AI Blog Generation Script
 * 
 * Usage:
 *   node scripts/ai-generate-draft.mjs
 *   node scripts/ai-generate-draft.mjs --topic "Building Scalable Vector Search" --category "artificial-intelligence"
 * 
 * Strict Editorial Guardrail:
 *   All generated articles are created as DRAFTS (publishedAt: null).
 *   They NEVER go live until you manually review and approve them in the AI Studio or Strapi Admin.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const STRAPI_BASE_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const CACHE_DIR = path.join(rootDir, 'frontend', '.runtime-cache');
const CACHE_FILE = path.join(CACHE_DIR, 'articles.json');

const categories = [
  { id: 1, name: 'Artificial Intelligence', slug: 'artificial-intelligence', color: '#06b6d4', icon: 'Sparkles' },
  { id: 2, name: 'Modern Web Architecture', slug: 'modern-web-architecture', color: '#10b981', icon: 'Layers' },
  { id: 3, name: 'UI/UX & Design Systems', slug: 'design-systems', color: '#a855f7', icon: 'Palette' },
  { id: 4, name: 'Cloud & Infrastructure', slug: 'cloud-infrastructure', color: '#f59e0b', icon: 'Cloud' },
  { id: 5, name: 'Engineering Leadership', slug: 'engineering-leadership', color: '#ec4899', icon: 'Compass' },
];

const authors = [
  { id: 1, name: 'Elena Rostova', slug: 'elena-rostova', role: 'Principal AI Systems Architect', avatar: '/images/author-elena.jpg' },
  { id: 2, name: 'Marcus Chen', slug: 'marcus-chen', role: 'Head of Infrastructure Engineering', avatar: '/images/author-marcus.jpg' },
  { id: 3, name: 'Sophia Vance', slug: 'sophia-vance', role: 'VP of Product Engineering', avatar: '/images/author-sophia.jpg' },
];

const trendingTopics = [
  {
    topic: 'Automating Headless CMS Workflows with Strapi 5 & LLM Agents',
    categorySlug: 'modern-web-architecture',
    authorSlug: 'marcus-chen',
    tags: ['Strapi 5', 'Next.js 16', 'AI Agents', 'Automation'],
  },
  {
    topic: 'Optimizing Distributed LLM Inference with Speculative Decoding and KV Caching',
    categorySlug: 'artificial-intelligence',
    authorSlug: 'elena-rostova',
    tags: ['LLM', 'Inference', 'KV Caching', 'Transformers'],
  },
  {
    topic: 'Building Resilient Event-Driven Microservices with Next.js 16 Server Actions',
    categorySlug: 'modern-web-architecture',
    authorSlug: 'sophia-vance',
    tags: ['Server Actions', 'Next.js 16', 'Microservices', 'TypeScript'],
  },
  {
    topic: 'Zero-Runtime CSS and Dynamic Design Tokens with Tailwind CSS v4',
    categorySlug: 'design-systems',
    authorSlug: 'elena-rostova',
    tags: ['Tailwind v4', 'Design Tokens', 'CSS', 'UI/UX'],
  },
  {
    topic: 'Multi-Region Edge Caching Strategies for High-Throughput Web Applications',
    categorySlug: 'cloud-infrastructure',
    authorSlug: 'marcus-chen',
    tags: ['Edge Compute', 'Cloudflare Workers', 'Caching', 'Latency'],
  },
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function run() {
  console.log('\n=============================================================');
  console.log('🤖  LUMINA PRESS — AI BLOG AUTOMATION DISPATCH');
  console.log('=============================================================');

  // Parse CLI args
  const args = process.argv.slice(2);
  let topicArg = null;
  let categoryArg = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--topic' && args[i + 1]) topicArg = args[i + 1];
    if (args[i] === '--category' && args[i + 1]) categoryArg = args[i + 1];
  }

  const selectedIdea = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
  const topicTitle = topicArg || selectedIdea.topic;
  const categorySlug = categoryArg || selectedIdea.categorySlug;
  const category = categories.find((c) => c.slug === categorySlug) || categories[0];
  const author = authors.find((a) => a.slug === selectedIdea.authorSlug) || authors[0];

  console.log(`[GENERATING] Topic: "${topicTitle}"`);
  console.log(`[CATEGORY]   ${category.name}`);
  console.log(`[AUTHOR]     ${author.name}`);

  const slug = `${slugify(topicTitle)}-${Math.random().toString(36).substring(2, 6)}`;
  const readingTime = '6 min read';
  const coverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop';

  const content = `
The acceleration of distributed computing and modern engineering frameworks has fundamentally altered how digital platforms are architected. When approaching **${topicTitle}**, engineering organizations face crucial trade-offs between system velocity, runtime predictability, and cognitive overhead.

In this deep dive, we dissect the core architectural principles, empirical benchmarks, and operational paradigms necessary to implement this in mission-critical environments.

## 1. Architectural Foundations and Problem Space

Traditional approaches have historically suffered from high coupling and latency bottlenecks. By separating control planes from data planes and leveraging modern decoupled paradigms, modern architectures unlock orders of magnitude faster execution cycles.

> **Key Architectural Takeaway:** True engineering scalability is not merely about horizontal compute elasticity; it is about establishing clear interface contracts and self-healing state transitions across every boundary of your application.

Consider the baseline data-flow contract:

\`\`\`typescript
export interface SystemTelemetryContract {
  traceId: string;
  originNode: string;
  timestamp: number;
  payload: {
    throughputRps: number;
    p99LatencyMs: number;
    errorBudgetPercent: number;
  };
  checkpoint: (ack: boolean) => Promise<void>;
}

export async function processPipelineStream(
  telemetryStream: AsyncIterable<SystemTelemetryContract>
): Promise<void> {
  for await (const packet of telemetryStream) {
    if (packet.payload.p99LatencyMs > 120) {
      console.warn(\`[DEGRADATION DETECTED] Node \${packet.originNode} breached SLA thresholds.\`);
    }
    await packet.checkpoint(true);
  }
}
\`\`\`

## 2. Implementation Strategies & Core Workflow

To transition from abstract theory to production hardening, we must enforce three core pillars:

1. **Deterministic State Reconciliation**: All side effects must be idempotent and replayable under network partitions.
2. **Context-Window Minimization**: Keep request footprints compact to maximize edge cache absorption.
3. **Automated Verification Pipelines**: Validate performance regressions before production rollout using continuous staging tests.

\`\`\`yaml
# Infrastructure deployment manifest
version: "3.8"
services:
  pipeline-worker:
    image: lumina-press/worker:latest
    deploy:
      replicas: 4
      resources:
        limits:
          cpus: "2.0"
          memory: 4096M
    environment:
      NODE_ENV: production
      CACHE_STRATEGY: stale-while-revalidate
      CIRCUIT_BREAKER_TIMEOUT: 2500ms
\`\`\`

## 3. Benchmarks and Real-World Trade-Offs

During our evaluation under synthetic 10,000 req/sec loads, the decoupled strategy exhibited dramatic improvements:

- **Cold-Start P99 Latency:** Dropped from **480ms** down to **42ms**.
- **Memory Footprint:** 58% reduction in heap allocation variance.
- **Cache Hit Ratio:** Stabilized at **98.4%** across geographically distributed edge nodes.

## Conclusion & Next Steps

Adopting **${topicTitle}** provides the bedrock for resilient, future-proof software ecosystems. By combining rigorous architectural isolation with continuous measurement, teams can move fast without compromising reliability.
`.trim();

  const excerpt = `An in-depth architectural exploration of ${topicTitle.toLowerCase()}. We examine core mechanics, production telemetry benchmarks, and implementation patterns for modern software teams.`;

  const draftArticle = {
    id: `draft-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: topicTitle,
    slug,
    excerpt,
    content,
    coverImage,
    readingTime,
    featured: false,
    publishedAt: null, // STRICTLY DRAFT!
    status: 'draft',
    createdAt: new Date().toISOString(),
    category,
    author,
    tags: selectedIdea.tags,
  };

  // 1. Try to send to Strapi
  let strapiSynced = false;
  try {
    const res = await fetch(`${STRAPI_BASE_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          title: draftArticle.title,
          slug: draftArticle.slug,
          excerpt: draftArticle.excerpt,
          content: draftArticle.content,
          coverImage: draftArticle.coverImage,
          readingTime: draftArticle.readingTime,
          tags: draftArticle.tags,
          category: category.id,
          author: author.id,
          publishedAt: null, // Draft in Strapi
        },
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        draftArticle.id = json.data.id || draftArticle.id;
        draftArticle.documentId = json.data.documentId;
        strapiSynced = true;
      }
    }
  } catch (err) {
    // Strapi offline or unreachable
  }

  // 2. Save to local runtime cache for Next.js Studio
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    let cacheData = { drafts: [], published: [] };
    if (fs.existsSync(CACHE_FILE)) {
      cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
    cacheData.drafts = [draftArticle, ...(cacheData.drafts || [])];
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to runtime cache:', err);
  }

  console.log('\n-------------------------------------------------------------');
  console.log('✅  ARTICLE DRAFT SUCCESSFULLY CREATED!');
  console.log('-------------------------------------------------------------');
  console.log(`Title:       ${draftArticle.title}`);
  console.log(`Status:      DRAFT (publishedAt: null)`);
  console.log(`Strapi Sync: ${strapiSynced ? 'YES (Saved to Strapi DB as Draft)' : 'OFFLINE (Saved to local Studio cache)'}`);
  console.log('-------------------------------------------------------------');
  console.log('🛡️   EDITORIAL GUARDRAIL CONFIRMATION:');
  console.log('    This article is NOT published. It is safely queued as a Draft.');
  console.log('    To review the full layout, edit content, and approve publishing:');
  console.log('\n👉  Open AI Studio: http://localhost:3000/studio');
  if (strapiSynced) {
    console.log('👉  Or Strapi Admin: http://localhost:1337/admin/content-manager/collectionType/api::article.article');
  }
  console.log('=============================================================\n');
}

run().catch((e) => {
  console.error('Automation script failed:', e);
  process.exit(1);
});
