export interface Category {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  count?: number;
}

export interface Author {
  id: number | string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  stats?: {
    articlesCount: number;
    followers: string;
    views: string;
  };
}

export interface Article {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  readingTime: string;
  featured?: boolean;
  publishedAt: string;
  category: Category;
  author: Author;
  tags: string[];
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  topic: string;
  message: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  date: string;
  content: string;
}
