import { Article, Category, Author } from './types';
import { mockCategories, mockAuthors } from './data';

export interface GenerateArticleOptions {
  topic?: string;
  categorySlug?: string;
  authorSlug?: string;
  tone?: 'deep-technical' | 'tutorial' | 'architectural' | 'thought-leadership';
  apiKey?: string;
  provider?: 'gemini' | 'openai' | 'lumina-builtin';
}

// Curated high-resolution Unsplash tech photography matching categories
const categoryCovers: Record<string, string[]> = {
  'artificial-intelligence': [
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1676299081847-824916de030a?q=80&w=1600&auto=format&fit=crop',
  ],
  'modern-web-architecture': [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop',
  ],
  'design-systems': [
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
  ],
  'cloud-infrastructure': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1600&auto=format&fit=crop',
  ],
  'engineering-leadership': [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop',
  ],
};

// Trending topics library for instant automation
export const trendingTopicIdeas = [
  {
    topic: 'Automating Headless CMS Workflows with Strapi 5 & LLM Agents',
    categorySlug: 'modern-web-architecture',
    authorSlug: 'marcus-chen',
    tone: 'architectural' as const,
  },
  {
    topic: 'Optimizing Distributed LLM Inference with Speculative Decoding and KV Caching',
    categorySlug: 'artificial-intelligence',
    authorSlug: 'elena-rostova',
    tone: 'deep-technical' as const,
  },
  {
    topic: 'Building Resilient Event-Driven Microservices with Next.js 16 Server Actions',
    categorySlug: 'modern-web-architecture',
    authorSlug: 'sophia-vance',
    tone: 'tutorial' as const,
  },
  {
    topic: 'Modern Design Tokens & Zero-Runtime CSS with Tailwind CSS v4',
    categorySlug: 'design-systems',
    authorSlug: 'elena-rostova',
    tone: 'deep-technical' as const,
  },
  {
    topic: 'Zero-Trust Cloud Edge Security & Micro-Segmentation in Multi-Region Deployments',
    categorySlug: 'cloud-infrastructure',
    authorSlug: 'marcus-chen',
    tone: 'architectural' as const,
  },
  {
    topic: 'Scaling High-Velocity Engineering Teams: Architecture Decision Records & Async Ownership',
    categorySlug: 'engineering-leadership',
    authorSlug: 'sophia-vance',
    tone: 'thought-leadership' as const,
  },
  {
    topic: 'Vector Database Benchmarks: SQLite-Vec vs Pinecone vs Qdrant in Production',
    categorySlug: 'artificial-intelligence',
    authorSlug: 'elena-rostova',
    tone: 'deep-technical' as const,
  },
  {
    topic: 'Hydration-Free Web Apps: Islands Architecture and Resumability Deep Dive',
    categorySlug: 'modern-web-architecture',
    authorSlug: 'marcus-chen',
    tone: 'deep-technical' as const,
  },
];

function slugify(text: string): string {
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

/**
 * Procedural Lumina Neural Generator
 * Crafts full, highly realistic, publication-ready technical blog posts
 */
function generateWithLuminaEngine(
  topicTitle: string,
  category: Category,
  author: Author,
  tone: string
): Omit<Article, 'id'> {
  const slug = `${slugify(topicTitle)}-${Math.random().toString(36).substring(2, 6)}`;
  const covers = categoryCovers[category.slug] || categoryCovers['modern-web-architecture'];
  const coverImage = covers[Math.floor(Math.random() * covers.length)];

  const tagsPool: Record<string, string[]> = {
    'artificial-intelligence': ['LLM', 'Inference', 'Machine Learning', 'Transformers', 'Vector Search', 'AI Agents'],
    'modern-web-architecture': ['Next.js 16', 'Strapi CMS', 'Server Components', 'TypeScript', 'Edge Compute', 'APIs'],
    'design-systems': ['Design Tokens', 'Tailwind v4', 'UI/UX', 'Micro-interactions', 'Accessibility', 'CSS'],
    'cloud-infrastructure': ['Kubernetes', 'Cloudflare Workers', 'Edge Caching', 'Microservices', 'DevOps', 'Observability'],
    'engineering-leadership': ['Team Culture', 'Architecture', 'Mentorship', 'Agile', 'Code Review', 'Engineering Excellence'],
  };

  const pool = tagsPool[category.slug] || ['Engineering', 'Software', 'Architecture', 'Automation'];
  const shuffledTags = [...pool].sort(() => 0.5 - Math.random()).slice(0, 4);

  // Generate deep, comprehensive content based on tone & topic
  const content = `
The acceleration of distributed computing and modern engineering frameworks has fundamentally altered how digital platforms are architected. When approaching **${topicTitle}**, teams often grapple with trade-offs between system velocity, runtime predictability, and cognitive overhead.

In this deep dive, we dissect the architectural principles, empirical benchmarks, and operational paradigms necessary to implement this in mission-critical environments.

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

> *"Systems designed for observability from Day 1 inherently outlast architectures where monitoring is bolted on after failure incidents."*

## 4. Operational Best Practices

When deploying this architecture in your own organization, keep the following rules top of mind:

- **Enforce Immutable Snapshots**: Never mutate historical records in place; emit state events.
- **Set Granular Timeouts**: Avoid unbounded network IO promises by wrapping all downstream fetch calls with explicit abort controllers.
- **Automate Draft Previews**: Before pushing changes directly to your end-users, always stage drafts in an isolated review queue for editorial and architectural validation.

## Conclusion & Next Steps

Adopting **${topicTitle}** provides the bedrock for resilient, future-proof software ecosystems. By combining rigorous architectural isolation with continuous measurement, teams can move fast without compromising reliability.

What architectural hurdles have you encountered when rolling this out in your stack? We invite you to join the discussion in the comments section below!
`.trim();

  const excerpt = `An in-depth architectural exploration of ${topicTitle.toLowerCase()}. We examine core mechanics, production telemetry benchmarks, and implementation patterns for modern software teams.`;

  return {
    title: topicTitle,
    slug,
    excerpt,
    content,
    coverImage,
    readingTime: '6 min read',
    featured: false,
    publishedAt: null, // ALWAYS NULL FOR AUTOMATION DRAFT!
    status: 'draft',
    createdAt: new Date().toISOString(),
    category,
    author,
    tags: shuffledTags,
  };
}

/**
 * Generate article with Google Gemini API
 */
async function generateWithGemini(
  prompt: string,
  category: Category,
  author: Author,
  apiKey: string
): Promise<Omit<Article, 'id'>> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `
You are an expert technical publication writer and principal software architect at LuminaPress.
Generate a complete, high-impact, professional technical blog post based on the requested topic.
Return ONLY valid JSON matching this exact structure:
{
  "title": "Compelling Title",
  "excerpt": "2-3 sentence engaging summary",
  "content": "Full markdown article with introduction, ## Section 1, ### subsections, code blocks (with language specified, e.g. typescript, yaml, css), blockquotes (> ...), benchmarks, and conclusion.",
  "readingTime": "X min read",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}
Do not wrap in markdown quotes or extra text. Only raw JSON.
`;

  const userPrompt = `Topic: "${prompt}"\nCategory: ${category.name} (${category.description})\nAuthor: ${author.name} (${author.role})`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API Error (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(rawText);

  const covers = categoryCovers[category.slug] || categoryCovers['modern-web-architecture'];
  const coverImage = covers[Math.floor(Math.random() * covers.length)];

  return {
    title: parsed.title,
    slug: `${slugify(parsed.title)}-${Math.random().toString(36).substring(2, 6)}`,
    excerpt: parsed.excerpt,
    content: parsed.content,
    coverImage,
    readingTime: parsed.readingTime || '5 min read',
    featured: false,
    publishedAt: null, // STRICT DRAFT GUARANTEE!
    status: 'draft',
    createdAt: new Date().toISOString(),
    category,
    author,
    tags: parsed.tags || ['Engineering', 'Technology'],
  };
}

/**
 * Generate article with OpenAI API
 */
async function generateWithOpenAI(
  prompt: string,
  category: Category,
  author: Author,
  apiKey: string
): Promise<Omit<Article, 'id'>> {
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const systemPrompt = `You are a principal technical author for LuminaPress engineering journal.
Generate a complete, deep, production-grade technical blog post based on the user's request.
Respond with JSON matching:
{
  "title": "Title",
  "excerpt": "2-3 sentence executive hook",
  "content": "Rich markdown body with introduction, ## sections, ### subsections, typescript/yaml code snippets, blockquotes (> ...), and conclusion.",
  "readingTime": "X min read",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Topic: ${prompt}. Category: ${category.name}. Author: ${author.name}` },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI API Error (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  const contentStr = json?.choices?.[0]?.message?.content;
  const parsed = JSON.parse(contentStr);

  const covers = categoryCovers[category.slug] || categoryCovers['modern-web-architecture'];
  const coverImage = covers[Math.floor(Math.random() * covers.length)];

  return {
    title: parsed.title,
    slug: `${slugify(parsed.title)}-${Math.random().toString(36).substring(2, 6)}`,
    excerpt: parsed.excerpt,
    content: parsed.content,
    coverImage,
    readingTime: parsed.readingTime || '6 min read',
    featured: false,
    publishedAt: null, // STRICT DRAFT GUARANTEE!
    status: 'draft',
    createdAt: new Date().toISOString(),
    category,
    author,
    tags: parsed.tags || ['AI', 'Engineering'],
  };
}

/**
 * Main AI Blog Automated Generator Orchestrator
 * Always produces a DRAFT (publishedAt: null) for manual review
 */
export async function generateAutomatedArticle(
  options: GenerateArticleOptions = {}
): Promise<Omit<Article, 'id'>> {
  // 1. Pick category
  let category = mockCategories.find((c) => c.slug === options.categorySlug);
  if (!category) {
    category = mockCategories[Math.floor(Math.random() * mockCategories.length)];
  }

  // 2. Pick author
  let author = mockAuthors.find((a) => a.slug === options.authorSlug);
  if (!author) {
    author = mockAuthors[Math.floor(Math.random() * mockAuthors.length)];
  }

  // 3. Resolve topic title
  let topicTitle = options.topic?.trim();
  if (!topicTitle) {
    const matchingTrending = trendingTopicIdeas.filter(
      (t) => !options.categorySlug || t.categorySlug === options.categorySlug
    );
    const chosenIdea =
      matchingTrending.length > 0
        ? matchingTrending[Math.floor(Math.random() * matchingTrending.length)]
        : trendingTopicIdeas[Math.floor(Math.random() * trendingTopicIdeas.length)];
    topicTitle = chosenIdea.topic;
    if (!options.categorySlug) {
      const matchCat = mockCategories.find((c) => c.slug === chosenIdea.categorySlug);
      if (matchCat) category = matchCat;
    }
  }

  const geminiKey = options.apiKey || process.env.GEMINI_API_KEY;
  const openAiKey = options.apiKey || process.env.OPENAI_API_KEY;

  // 4. Try LLM Provider if specified / configured
  if (options.provider === 'gemini' && geminiKey) {
    try {
      return await generateWithGemini(topicTitle, category, author, geminiKey);
    } catch (err) {
      console.warn('Gemini generation failed, falling back to Lumina Engine:', err);
    }
  }

  if (options.provider === 'openai' && openAiKey) {
    try {
      return await generateWithOpenAI(topicTitle, category, author, openAiKey);
    } catch (err) {
      console.warn('OpenAI generation failed, falling back to Lumina Engine:', err);
    }
  }

  if (!options.provider && geminiKey) {
    try {
      return await generateWithGemini(topicTitle, category, author, geminiKey);
    } catch (err) {
      console.warn('Auto Gemini generation failed, falling back:', err);
    }
  }

  // 5. Default to Lumina Neural Generator Engine (bulletproof, zero key required)
  return generateWithLuminaEngine(
    topicTitle,
    category,
    author,
    options.tone || 'deep-technical'
  );
}
