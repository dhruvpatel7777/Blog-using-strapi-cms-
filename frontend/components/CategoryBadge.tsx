import Link from 'next/link';

interface CategoryBadgeProps {
  name: string;
  slug: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CategoryBadge({
  name,
  slug,
  color = '#6366f1',
  size = 'md',
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  }[size];

  return (
    <Link
      href={`/category/${slug}`}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200 border hover:scale-105 ${sizeClasses}`}
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
        color: color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: color }}
      />
      {name}
    </Link>
  );
}
