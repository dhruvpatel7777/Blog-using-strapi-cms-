import { NextResponse } from 'next/server';
import { publishServerDraft } from '@/lib/runtime-store';
import { revalidatePath } from 'next/cache';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Draft id is required' }, { status: 400 });
    }

    const publishedDate = new Date().toISOString();
    const published = publishServerDraft(id);

    if (!published) {
      return NextResponse.json({ success: false, error: 'Draft not found' }, { status: 404 });
    }

    // Try to update Strapi
    try {
      const target = published.documentId || published.id;
      if (target) {
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
      }
    } catch (err) {
      // Strapi offline, published in runtime store
    }

    // Revalidate paths so the new post appears immediately
    try {
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath(`/blog/${published.slug}`);
      revalidatePath(`/category/${published.category.slug}`);
      revalidatePath(`/author/${published.author.slug}`);
    } catch (e) {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Article successfully approved and published to live blog!',
      article: published,
    });
  } catch (err: any) {
    console.error('Error publishing draft:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to publish draft' },
      { status: 500 }
    );
  }
}
