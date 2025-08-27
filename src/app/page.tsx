import { getAllArticles, getTodaysArticles } from '@/lib/data';
import ArticleList from '@/components/ArticleList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Newspaper, CalendarDays } from 'lucide-react';

export default async function Home() {
  const [todaysArticles, allArticles] = await Promise.all([
    getTodaysArticles(),
    getAllArticles(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="today">
            <CalendarDays className="mr-2" />
            Today
          </TabsTrigger>
          <TabsTrigger value="all">
            <Newspaper className="mr-2" />
            All Articles
          </TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <ArticleList articles={todaysArticles} />
        </TabsContent>
        <TabsContent value="all">
          <ArticleList articles={allArticles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}