'use client';

import { useState, useMemo } from 'react';
import type { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');

  const sources = useMemo(() => {
    return ['all', ...Array.from(new Set(articles.map((a) => a.source)))];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((article) =>
        selectedSource === 'all' ? true : article.source === selectedSource
      );
  }, [articles, searchQuery, selectedSource]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Filter by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            {sources.map((source) => (
              <SelectItem key={source} value={source}>
                {source === 'all' ? 'All Sources' : source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <h2 className="text-xl font-semibold">No articles found</h2>
          <p>Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
