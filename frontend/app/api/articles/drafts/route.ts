import { NextResponse } from 'next/server';
import { getServerDrafts, updateServerDraft, deleteServerDraft } from '@/lib/runtime-store';
import { Article } from '@/lib/types';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function GET() {
  const drafts = getServerDrafts();

  // Try to query Strapi for drafts if possible
  try {
    const res = await fetch(`${STRAPI_BASE_URL}/api/articles?filters[publishedAt][$null]=true&populate=*`, {
      headers: {
        ...(process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {}),
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        // Merge without duplicates
        const existingIds = new Set(drafts.map((d) => String(d.id)));
        for (const item of json.data) {
          const id = item.id;
          const attr = item.attributes || item;
          if (!existingIds.has(String(id))) {
            drafts.push({
              id,
              documentId: item.documentId,
              title: attr.title,
              slug: attr.slug,
              excerpt: attr.excerpt,
              content: attr.content,
              coverImage: attr.coverImage,
              readingTime: attr.readingTime || '5 min read',
              featured: attr.featured,
              publishedAt: null,
              status: 'draft',
              createdAt: attr.createdAt,
              category: attr.category?.data?.attributes || attr.category || {
                name: 'General',
                slug: 'general',
                color: '#6366f1',
                icon: 'Tag',
              },
              author: attr.author?.data?.attributes || attr.author || {
                name: 'Editorial Staff',
                slug: 'editorial-staff',
                role: 'Staff Writer',
                bio: 'LuminaPress editorial team',
                avatar: '/images/author-marcus.jpg',
                email: 'editor@lumina-press.dev',
              },
              tags: attr.tags || ['Draft'],
            } as Article);
          }
        }
      }
    }
  } catch (e) {
    // Strapi offline, return runtime drafts
  }

  return NextResponse.json({ success: true, drafts });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing draft id' }, { status: 400 });
    }

    const updated = updateServerDraft(id, updates);
    return NextResponse.json({ success: true, draft: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing draft id' }, { status: 400 });
    }

    deleteServerDraft(id);
    return NextResponse.json({ success: true, message: 'Draft deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
