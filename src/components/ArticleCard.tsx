import Link from 'next/link';
import { format, parse } from 'date-fns';
import type { Article } from '@/lib/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from './ui/badge';
import type React from 'react';

interface ArticleCardProps {
  article: Article;
  onSourceSelect: (source: string) => void;
  onCategorySelect: (category: string) => void;
}

export default function ArticleCard({
  article,
  onSourceSelect,
  onCategorySelect,
}: ArticleCardProps) {
  let formattedDate = article.pubDate;
  try {
    const date = parse(article.pubDate, 'dd-MM-yyyy HH:mm', new Date());
    formattedDate = format(date, 'MMMM d, yyyy');
  } catch (error) {
    // Keep original date if parsing fails
  }

  const handleBadgeClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    callback: () => void
  ) => {
    e.stopPropagation();
    e.preventDefault();
    callback();
  };

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group"
      aria-label={article.title}
    >
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-lg group-hover:text-primary">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex flex-wrap gap-1">
            {article.categories.slice(0, 3).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-accent"
                onClick={(e) => handleBadgeClick(e, () => onCategorySelect(category))}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
        <div className="flex-grow" />
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground pt-4">
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-primary/20"
            onClick={(e) => handleBadgeClick(e, () => onSourceSelect(article.source))}
          >
            {article.source}
          </Badge>
          <time dateTime={article.pubDate}>{formattedDate}</time>
        </CardFooter>
      </Card>
    </Link>
  );
}