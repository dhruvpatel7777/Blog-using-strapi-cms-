import { NextResponse } from 'next/server';
import { generateAutomatedArticle } from '@/lib/ai-generator';
import { addServerDraft } from '@/lib/runtime-store';
import { Article } from '@/lib/types';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { topic, categorySlug, authorSlug, tone, apiKey, provider } = body;

    // 1. Generate complete article with AI
    const generatedArticle = await generateAutomatedArticle({
      topic,
      categorySlug,
      authorSlug,
      tone,
      apiKey,
      provider,
    });

    const newId = `draft-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullDraft: Article = {
      ...generatedArticle,
      id: newId,
      publishedAt: null, // STRICTLY DRAFT: Cannot be published without manual review!
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    // 2. Try to sync to Strapi backend if active
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const strapiPayload = {
        data: {
          title: fullDraft.title,
          slug: fullDraft.slug,
          excerpt: fullDraft.excerpt,
          content: fullDraft.content,
          coverImage: fullDraft.coverImage,
          readingTime: fullDraft.readingTime,
          tags: fullDraft.tags,
          category: typeof fullDraft.category.id === 'number' ? fullDraft.category.id : undefined,
          author: typeof fullDraft.author.id === 'number' ? fullDraft.author.id : undefined,
          publishedAt: null, // Strapi draft & publish option
        },
      };

      const res = await fetch(`${STRAPI_BASE_URL}/api/articles`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {}),
        },
        body: JSON.stringify(strapiPayload),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          fullDraft.id = json.data.id || fullDraft.id;
          fullDraft.documentId = json.data.documentId;
        }
      }
    } catch (e) {
      // Strapi offline or unreachable, will save to server runtime cache
    }

    // 3. Save to server runtime store so it's instantly reviewable
    addServerDraft(fullDraft);

    return NextResponse.json({
      success: true,
      message: 'Article draft successfully generated! Review required before publishing.',
      draft: fullDraft,
    });
  } catch (err: any) {
    console.error('Error in AI generation route:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to generate article draft' },
      { status: 500 }
    );
  }
}
