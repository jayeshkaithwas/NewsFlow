import { getArticleBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import ArticleDetail from '@/components/ArticleDetail';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetail article={article} />;
}
