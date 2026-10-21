import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/strapi';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category') || undefined;
    const authorSlug = searchParams.get('author') || undefined;
    const search = searchParams.get('search') || undefined;
    const tag = searchParams.get('tag') || undefined;

    const articles = await getArticles({
      categorySlug,
      authorSlug,
      search,
      tag,
    });

    return NextResponse.json(articles);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
