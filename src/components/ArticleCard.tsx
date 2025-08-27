import Link from 'next/link';
import { format, parse } from 'date-fns';
import type { Article } from '@/lib/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from './ui/badge';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  let formattedDate = article.pubDate;
  try {
    const date = parse(article.pubDate, 'dd-MM-yyyy HH:mm', new Date());
    formattedDate = format(date, 'MMMM d, yyyy');
  } catch (error) {
    // Keep original date if parsing fails
  }

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
        <div className="flex-grow" />
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
          <Badge variant="secondary">{article.source}</Badge>
          <time dateTime={article.pubDate}>{formattedDate}</time>
        </CardFooter>
      </Card>
    </Link>
  );
}
