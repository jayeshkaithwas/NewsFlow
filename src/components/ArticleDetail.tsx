'use client';

import { useState } from 'react';
import type { Article } from '@/lib/types';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AiSummary from './AiSummary';
import { contentImprover } from '@/ai/flows/content-improver';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface ArticleDetailProps {
  article: Article;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
  const [isImproving, setIsImproving] = useState(false);
  const [improvedSummary, setImprovedSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImproveSummary = async () => {
    setIsImproving(true);
    setImprovedSummary(null);
    try {
      const result = await contentImprover({
        articleTitle: article.title,
        articleSummary: article.aiSummary,
      });
      setImprovedSummary(result.improvedSummary);
    } catch (error) {
      console.error('Failed to improve summary:', error);
      toast({
        title: 'Error',
        description: 'Could not improve the summary at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsImproving(false);
    }
  };

  let formattedDate = article.pubDate;
  try {
    const date = parse(article.pubDate, 'dd-MM-yyyy HH:mm', new Date());
    formattedDate = format(date, 'MMMM d, yyyy');
  } catch (error) {
    // Keep original date if parsing fails
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <article className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-muted-foreground">
            <Badge variant="secondary">{article.source}</Badge>
            <time dateTime={article.pubDate}>{formattedDate}</time>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              Read Full Article <ExternalLink className="ml-2" />
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={handleImproveSummary}
            disabled={isImproving}
          >
            {isImproving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2" />
            )}
            Enhance Readability
          </Button>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {isImproving && (
             <Card className="p-6">
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">AI is enhancing the summary...</p>
                </CardContent>
             </Card>
          )}
          {improvedSummary ? (
            <AiSummary summary={improvedSummary} />
          ) : (
            <AiSummary summary={article.aiSummary} />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
            {article.categories.map(category => (
                <Badge key={category} variant="outline">{category}</Badge>
            ))}
        </div>

      </article>
    </div>
  );
}
