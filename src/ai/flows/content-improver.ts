'use server';

/**
 * @fileOverview AI-powered content improver tool that summarizes and improves readability of articles.
 *
 * - contentImprover - A function that handles the content improvement process.
 * - ContentImproverInput - The input type for the contentImprover function.
 * - ContentImproverOutput - The return type for the contentImprover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentImproverInputSchema = z.object({
  articleTitle: z.string().describe('The title of the article.'),
  articleSummary: z.string().describe('The AI-generated summary of the article.'),
});
export type ContentImproverInput = z.infer<typeof ContentImproverInputSchema>;

const ContentImproverOutputSchema = z.object({
  improvedSummary: z.string().describe('The improved summary of the article.'),
});
export type ContentImproverOutput = z.infer<typeof ContentImproverOutputSchema>;

export async function contentImprover(input: ContentImproverInput): Promise<ContentImproverOutput> {
  return contentImproverFlow(input);
}

const contentImproverPrompt = ai.definePrompt({
  name: 'contentImproverPrompt',
  input: {schema: ContentImproverInputSchema},
  output: {schema: ContentImproverOutputSchema},
  prompt: `You are an expert content improver. You will receive an article title and a summary of the article. Your task is to improve the summary to make it more readable and concise, while retaining the key information.

Article Title: {{{articleTitle}}}
Article Summary: {{{articleSummary}}}

Improved Summary:`, 
});

const contentImproverFlow = ai.defineFlow(
  {
    name: 'contentImproverFlow',
    inputSchema: ContentImproverInputSchema,
    outputSchema: ContentImproverOutputSchema,
  },
  async input => {
    const {output} = await contentImproverPrompt(input);
    return output!;
  }
);
