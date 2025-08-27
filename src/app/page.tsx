import { getArticles } from '@/lib/data';
import ArticleList from '@/components/ArticleList';

export default async function Home() {
  const articles = await getArticles();

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleList articles={articles} />
    </div>
  );
}
