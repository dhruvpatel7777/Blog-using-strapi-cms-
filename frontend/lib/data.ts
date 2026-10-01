import { Article, Category, Author } from './types';

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Explore the frontiers of deep learning, LLMs, neural synthesis, and autonomous agent ecosystems.',
    color: '#06b6d4', // Cyan
    icon: 'Sparkles',
    count: 8,
  },
  {
    id: 2,
    name: 'Modern Web Architecture',
    slug: 'modern-web-architecture',
    description: 'Scalable frontend engineering, Next.js server components, edge compute, and headless CMS integrations.',
    color: '#10b981', // Emerald
    icon: 'Layers',
    count: 12,
  },
  {
    id: 3,
    name: 'UI/UX & Design Systems',
    slug: 'design-systems',
    description: 'Crafting responsive design tokens, fluid micro-interactions, accessible typography, and dark-mode aesthetics.',
    color: '#a855f7', // Purple
    icon: 'Palette',
    count: 7,
  },
  {
    id: 4,
    name: 'Cloud & Infrastructure',
    slug: 'cloud-infrastructure',
    description: 'Distributed microservices, serverless workflows, Kubernetes automation, and global caching patterns.',
    color: '#f59e0b', // Amber
    icon: 'Cloud',
    count: 5,
  },
  {
    id: 5,
    name: 'Engineering Leadership',
    slug: 'engineering-leadership',
    description: 'Cultivating high-output teams, remote engineering culture, architecture decision records, and technical mentorship.',
    color: '#ec4899', // Pink
    icon: 'Compass',
    count: 4,
  },
];

export const mockAuthors: Author[] = [
  {
    id: 1,
    name: 'Elena Rostova',
    slug: 'elena-rostova',
    role: 'Principal AI Systems Architect',
    bio: 'Pioneering multimodal neural architectures and context-window optimization. Previously led distributed inference research at Apex AI Labs. Passionate about open-source intelligence.',
    avatar: '/images/author-elena.jpg',
    email: 'elena.rostova@lumina-press.dev',
    socialLinks: {
      twitter: 'https://twitter.com/elenarostova',
      github: 'https://github.com/elenarostova',
      linkedin: 'https://linkedin.com/in/elenarostova',
      website: 'https://elena-ai.dev',
    },
    stats: {
      articlesCount: 6,
      followers: '14.2k',
      views: '180k',
    },
  },
  {
    id: 2,
    name: 'Marcus Chen',
    slug: 'marcus-chen',
    role: 'Staff Frontend Engineer & Core Contributor',
    bio: 'Specializing in Next.js internal runtime performance, hybrid streaming rendering, and headless CMS infrastructure. Speaker at React Summit and Global Web Conf.',
    avatar: '/images/author-marcus.jpg',
    email: 'marcus.chen@lumina-press.dev',
    socialLinks: {
      twitter: 'https://twitter.com/marcuschen_dev',
      github: 'https://github.com/marcuschen',
      linkedin: 'https://linkedin.com/in/marcuschen-dev',
      website: 'https://marcuschen.io',
    },
    stats: {
      articlesCount: 8,
      followers: '21.5k',
      views: '340k',
    },
  },
  {
    id: 3,
    name: 'Sophia Vance',
    slug: 'sophia-vance',
    role: 'Design Director & Interaction Specialist',
    bio: 'Crafting spatial interfaces, fluid motion graphics, and zero-latency design token pipelines. Advocating for accessible high-density interfaces and mindful UX patterns.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: 'sophia.vance@lumina-press.dev',
    socialLinks: {
      twitter: 'https://twitter.com/sophiavance',
      github: 'https://github.com/sophiavance',
      linkedin: 'https://linkedin.com/in/sophiavance',
      website: 'https://sophiavance.design',
    },
    stats: {
      articlesCount: 5,
      followers: '18.9k',
      views: '220k',
    },
  },
];

export const mockArticles: Article[] = [
  {
    id: 1,
    title: 'The Evolution of Autonomous Agents: Architecting Resilient Neural Workflows',
    slug: 'evolution-of-autonomous-agents',
    excerpt: 'How modern multi-agent coordination protocols and recursive context reasoning are transforming enterprise automation pipelines from experimental scripts to mission-critical infrastructure.',
    coverImage: '/images/ai-future.jpg',
    readingTime: '7 min read',
    featured: true,
    publishedAt: '2026-09-24T08:00:00.000Z',
    category: mockCategories[0],
    author: mockAuthors[0],
    tags: ['Artificial Intelligence', 'LLM', 'Autonomous Agents', 'Python', 'Machine Learning'],
    content: `
# The Next Wave of Autonomous Multi-Agent Reasoning

In the span of just twenty-four months, generative AI has transitioned from single-shot text completion to persistent, collaborative agent clusters capable of planning, inspecting runtime feedback, and autonomously synthesizing solutions.

However, as engineering organizations move past simple prompt engineering, the fundamental challenge has shifted toward **state synchronization, deterministic guardrails, and context economics**.

> "Autonomous intelligence is not merely bigger weights; it is the orchestrating framework that connects memory, perception, and tool verification into an unbroken feedback loop."

## The Architectural Blueprint

When building autonomous agents designed for production pipelines, monolithic agent designs fail quickly. Modern architectures isolate concerns across three decoupled tiers:

1. **The Tactical Decomposer**: Breaks complex user directives into atomic, falsifiable sub-tasks.
2. **The Execution Worker Pool**: Specialized sub-agents loaded with domain skills and narrow sandboxed toolsets.
3. **The Verification Critic**: Evaluates generated code, linting outputs, and test assertions before approving state transitions.

\`\`\`typescript
// Agent dispatch orchestrator schema
interface AgentPlanStep {
  id: string;
  objective: string;
  assignedAgent: 'coder' | 'reviewer' | 'tester';
  dependencies: string[];
  status: 'pending' | 'executing' | 'verified' | 'failed';
}

async function orchestrateWorkflow(plan: AgentPlanStep[]) {
  const dag = buildExecutionGraph(plan);
  for (const node of dag.resolveTopologicalOrder()) {
    const result = await dispatchSubagent(node);
    if (!result.assertionsPassed) {
      return triggerSelfHealingLoop(node, result.errorTrace);
    }
  }
}
\`\`\`

### Context Budgeting & Sliding Windows

As LLM context windows expand into millions of tokens, the common fallacy is assuming context retrieval is costless. In reality, retrieval latency increases linearly, while attention degradation (the "lost-in-the-middle" phenomenon) introduces subtle logic drift.

By implementing strict knowledge distillation and localized memory caching, we observed a **42% reduction in token burn** and a **3.4x improvement in cold-start execution speed**.

### Where We Go From Here

The future is not just bigger foundation models; it is autonomous self-correcting swarms that treat compiler warnings and runtime logs as first-class sensory inputs. When paired with headless CMS content flows, we can achieve real-time dynamic publication, semantic translation, and targeted editorial audits on autopilot.
`,
  },
  {
    id: 2,
    title: 'Building Hyper-Performant Digital Experiences with Next.js and Strapi 5',
    slug: 'hyper-performant-nextjs-strapi-5',
    excerpt: 'A comprehensive deep dive into leveraging Next.js React Server Components alongside Strapi 5 headless CMS, featuring incremental static regeneration, typed schemas, and edge caching.',
    coverImage: '/images/web-arch.jpg',
    readingTime: '6 min read',
    featured: true,
    publishedAt: '2026-09-20T11:30:00.000Z',
    category: mockCategories[1],
    author: mockAuthors[1],
    tags: ['Next.js', 'Strapi CMS', 'TypeScript', 'Performance', 'Fullstack'],
    content: `
# Architectural Synergy: Next.js and Strapi CMS

Modern digital publishing demands lightning-fast page delivery, frictionless content editing experiences, and uncompromising developer ergonomics. Combining the power of Next.js and Strapi 5 headless CMS unlocks the ideal balance between editorial independence and cutting-edge frontend performance.

## Why Headless Architecture Dominates in 2026

Traditional monolithic CMS solutions couple database persistence, template rendering, and frontend presentation into tightly locked monoliths. By decoupling the presentation layer through Strapi's REST & GraphQL interfaces:

- **Zero Content Bottlenecks**: Editorial teams write and publish drafts independently in Strapi's intuitive admin dashboard.
- **Edge Deployment**: Frontends compile into optimized server components and static edge payloads distributed across worldwide CDNs.
- **Strict Type Safety**: Automated TypeScript generation bridges backend models with frontend UI component contracts.

\`\`\`tsx
// Typed Strapi fetch client with Next.js revalidation
export async function getStrapiArticles(): Promise<Article[]> {
  const res = await fetch(\`\${process.env.STRAPI_API_URL}/api/articles?populate=*\`, {
    next: { revalidate: 60, tags: ['articles'] },
    headers: {
      Authorization: \`Bearer \${process.env.STRAPI_API_TOKEN}\`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch content from Strapi CMS');
  const { data } = await res.json();
  return normalizeStrapiResponse(data);
}
\`\`\`

### Hybrid Rendering Strategies

1. **Static Pre-Rendering (SSG)** for top evergreen articles and landing pages.
2. **On-Demand Incremental Static Regeneration (ISR)** triggered by Strapi Webhook web-dispatchers whenever an editor presses "Publish".
3. **Dynamic Streaming** for search filters, author analytics, and real-time community feedback threads.

By separating heavy content databases from the edge layer, users experience instant sub-100ms page transitions while editors retain full editorial freedom.
`,
  },
  {
    id: 3,
    title: 'Designing Cohesive Design Systems: Micro-Interactions, Tokens, and Glassmorphism',
    slug: 'designing-cohesive-design-systems',
    excerpt: 'How to construct an immersive, tactile design language that balances sleek dark-mode aesthetics, fluid cubic-bezier animations, and accessible contrast compliance.',
    coverImage: '/images/design-ui.jpg',
    readingTime: '5 min read',
    featured: false,
    publishedAt: '2026-09-17T14:15:00.000Z',
    category: mockCategories[2],
    author: mockAuthors[2],
    tags: ['UI Design', 'Design Systems', 'CSS', 'Micro-Interactions', 'Aesthetics'],
    content: `
# Crafting Tactile Interfaces in the Digital Era

Flat design stripped digital products of their depth and warmth. As displays have matured to high-refresh HDR OLEDs, modern web experiences are returning to tactile physical principles: **ambient lighting, prismatic refraction, and intentional micro-interactions**.

## Anatomy of Modern Glassmorphism

Glassmorphism done poorly is illegible; done properly, it provides instant spatial depth and visual hierarchy without heavy opaque borders.

\`\`\`css
/* High-performance hardware-accelerated glass panel */
.glass-surface {
  background: rgba(18, 18, 24, 0.72);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 20px 40px -15px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-surface:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 
    0 25px 50px -12px rgba(99, 102, 241, 0.15),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
}
\`\`\`

### Fluid Typography and Design Tokens

A design system should never rely on hardcoded magic numbers. By establishing semantic design tokens:

- **Surface Levels**: Background 0 -> Surface 1 -> Surface 2 -> Overlay.
- **Intent Colors**: Primary Indigo, Accent Cyan, Emerald Success, Amber Attention.
- **Rhythmic Scales**: Base-4 or Base-8 spatial grid matching proportional line heights.

Every interactive touchpoint—from card hover states to search focus rings—communicates physical responsiveness to the human user.
`,
  },
  {
    id: 4,
    title: 'Zero-Downtime Multi-Region Infrastructure for High-Traffic Content Hubs',
    slug: 'zero-downtime-multi-region-infrastructure',
    excerpt: 'Mastering distributed database replication, multi-cloud edge networks, and failover topologies to guarantee 99.999% availability during traffic surges.',
    coverImage: '/images/cloud-scale.jpg',
    readingTime: '8 min read',
    featured: false,
    publishedAt: '2026-09-12T09:45:00.000Z',
    category: mockCategories[3],
    author: mockAuthors[1],
    tags: ['DevOps', 'Cloud', 'Kubernetes', 'Scalability', 'Infrastructure'],
    content: `
# Architectural Resilience at 100M Requests Per Day

When viral articles hit the front page of social networks or major syndication feeds, unoptimized web platforms buckle under sudden spikes. Building infrastructure that scales effortlessly without manual intervention requires shifting from single-datacenter assumptions to **active-active distributed edge meshes**.

## Core Tenets of Resilient Publication

1. **Decoupled Edge Stale-While-Revalidate**: Even during upstream database cold restarts, the edge cache serves fresh static renders to readers.
2. **Geo-Distributed SQLite & Read Replicas**: Utilizing edge databases like Fly.io LiteFS or Cloudflare D1 to position content within 15ms of every visitor worldwide.
3. **Circuit Breaker Patterns**: Gracefully falling back to cached JSON snapshots when origin CMS endpoints experience latency spikes.

\`\`\`yaml
# Resilience policy configuration
resiliencePolicy:
  maxRetries: 3
  backoff:
    type: exponential
    initialDelayMs: 150
    maxDelayMs: 2000
  circuitBreaker:
    failureThresholdPercentage: 25
    samplingDurationMs: 10000
    fallbackStrategy: serveCachedSnapshot
\`\`\`

By engineering resilience from day one, your digital publication stays fast, secure, and always accessible regardless of global traffic anomalies.
`,
  },
  {
    id: 5,
    title: 'The Art of Technical Writing: Turning Complex Engineering into Compelling Stories',
    slug: 'art-of-technical-writing',
    excerpt: 'Strategies, storytelling structures, and editorial frameworks for engineers looking to articulate intricate technical systems with clarity and persuasion.',
    coverImage: '/images/web-arch.jpg',
    readingTime: '5 min read',
    featured: false,
    publishedAt: '2026-09-08T16:00:00.000Z',
    category: mockCategories[4],
    author: mockAuthors[0],
    tags: ['Writing', 'Engineering', 'Communication', 'Career'],
    content: `
# Why Clear Writing is the Greatest Force Multiplier

Code is read far more often than it is written; technical proposals are debated far more often than they are merged. The engineers who advance the fastest in modern tech are those who master the art of structured technical communication.

## The Narrative Arch of an Engineering Essay

Great technical writing avoids dry manuals in favor of discovery arcs:

1. **The Agony of the Status Quo**: Clearly demonstrate the painful failure mode or limitation before presenting your solution.
2. **The Counter-Intuitive Breakthrough**: Explain why naive approaches fall short and introduce your mental model.
3. **Concrete Verification**: Provide reproducible benchmarks, real code samples, and actionable trade-offs.

When your ideas are communicated with clarity and empathy, your architectural vision becomes unstoppable.
`,
  },
  {
    id: 6,
    title: 'Design Tokens in 2026: Bridging the Void Between Figma and Production Code',
    slug: 'design-tokens-figma-to-code',
    excerpt: 'Automating the transformation of design variables directly into Tailwind themes, CSS variables, and native UI component props with zero manual copy-pasting.',
    coverImage: '/images/design-ui.jpg',
    readingTime: '6 min read',
    featured: false,
    publishedAt: '2026-09-02T13:20:00.000Z',
    category: mockCategories[2],
    author: mockAuthors[2],
    tags: ['Design Tokens', 'Figma', 'Tailwind', 'Automation', 'Frontend'],
    content: `
# The Continuous Delivery Pipeline for UI Design

For years, the handoff between design and engineering was a friction-filled manual translation. Designers created specs in Figma, and developers manually approximated hex codes and pixel spacings in stylesheets.

Today, design token synchronizers treat design variables as versioned code assets in Git repositories.

## The Automated Token Workflow

Whenever a designer updates a color palette or spacing curve:

1. A Figma Webhook triggers a GitHub Action.
2. Style Dictionary transforms the raw JSON tokens into Tailwind theme configurations and CSS custom properties.
3. A Pull Request is automatically opened with automated visual regression diffs.

This pipeline eliminates design drift entirely, ensuring 100% fidelity across all digital touchpoints.
`,
  },
];
