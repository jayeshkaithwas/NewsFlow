import { cache } from 'react';
import type { Article } from './types';

const SHEET_ID = '1SGYctcCWYHDxpuzv5o2Hp1uveRuOrnpRJ1DmaSUii7g';
const ALL_ARTICLES_GID = '0';
const TODAY_ARTICLES_GID = '1944615086';

const ALL_ARTICLES_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${ALL_ARTICLES_GID}`;
const TODAY_ARTICLES_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${TODAY_ARTICLES_GID}`;

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const normalizedText = text.replace(/\r\n/g, '\n').trim();

  for (let i = 0; i < normalizedText.length; i++) {
    const char = normalizedText[i];
    const nextChar = i + 1 < normalizedText.length ? normalizedText[i + 1] : null;

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field);
        field = '';
      } else if (char === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += char;
      }
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

const fetchArticles = async (url: string): Promise<Article[]> => {
    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}`);
        }
        const text = await response.text();
        const rows = parseCSV(text);
    
        // Skip header row
        const dataRows = rows.slice(1);
    
        return dataRows
          .map((row, index) => {
            if (row.length < 6) return null;
            try {
              const [pubDate, source, title, link, categoriesStr, aiSummary] = row;
              const cleanedTitle = title.replace(/&#8217;/g, "'");
              return {
                id: String(index),
                slug: `${slugify(cleanedTitle)}-${index}`,
                pubDate,
                source,
                title: cleanedTitle,
                link,
                categories: JSON.parse(
                  categoriesStr.replace(/'/g, '"')
                ),
                aiSummary,
              };
            } catch (e) {
              console.error(`Error parsing row ${index + 1}:`, row, e);
              return null;
            }
          })
          .filter((article): article is Article => article !== null);
      } catch (error) {
        console.error('Error fetching or parsing articles:', error);
        return [];
      }
};

export const getAllArticles = cache(async (): Promise<Article[]> => {
    return fetchArticles(ALL_ARTICLES_URL);
});

export const getTodaysArticles = cache(async (): Promise<Article[]> => {
    return fetchArticles(TODAY_ARTICLES_URL);
});

export const getArticleBySlug = async (
  slug: string
): Promise<Article | undefined> => {
  const allArticles = await getAllArticles();
  const todaysArticles = await getTodaysArticles();
  const articles = [...allArticles, ...todaysArticles];
  
  // Remove duplicates
  const uniqueArticles = Array.from(new Map(articles.map(a => [a.slug, a])).values());
  
  return uniqueArticles.find((article) => article.slug === slug);
};
