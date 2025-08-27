'use client';

import { useMemo } from 'react';

const parseMarkdown = (text: string) => {
  return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

const AiSummary = ({ summary }: { summary: string }) => {
  const elements = useMemo(() => {
    if (!summary) return [];

    const parts: React.ReactNode[] = [];
    const lines = summary.split('\n').filter((line) => line.trim() !== '');

    let introParagraph = '';
    let currentListItems: React.ReactNode[] = [];
    let isIntro = true;

    const pushList = () => {
      if (currentListItems.length > 0) {
        parts.push(
          <ul
            key={`list-${parts.length}`}
            className="list-disc list-inside space-y-2 my-4"
          >
            {currentListItems}
          </ul>
        );
        currentListItems = [];
      }
    };
    
    const pushIntro = () => {
        if(introParagraph){
            parts.push(
                <p key="intro" className="my-4 leading-relaxed">
                  {parseMarkdown(introParagraph.trim())}
                </p>
              );
              introParagraph = '';
        }
    };

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (isIntro) {
            pushIntro();
        }
        isIntro = false;
        pushList();
        parts.push(
          <h2
            key={`h2-${parts.length}`}
            className="text-2xl font-bold font-headline mt-8 mb-4 border-b pb-2"
          >
            {parseMarkdown(line.replace('## ', '').trim())}
          </h2>
        );
      } else if (line.startsWith('- ')) {
        if (isIntro) {
            pushIntro();
        }
        isIntro = false;
        currentListItems.push(
          <li key={`li-${parts.length}-${currentListItems.length}`}>
            {parseMarkdown(line.replace('- ', '').trim())}
          </li>
        );
      } else if (isIntro) {
        introParagraph += line.trim() + ' ';
      } else {
        // This handles paragraphs that are not part of the intro and not list items.
        pushList(); // Push any existing list items first
        parts.push(
          <p key={`p-${parts.length}`} className="my-4 leading-relaxed">
            {parseMarkdown(line.trim())}
          </p>
        );
      }
    }

    pushIntro();
    pushList();

    return parts;
  }, [summary]);

  return <div>{elements}</div>;
};

export default AiSummary;
