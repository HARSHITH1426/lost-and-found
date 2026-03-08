'use server';
/**
 * @fileOverview A generative AI tool to assist users and staff in crafting clear, concise, and comprehensive descriptions for lost and found items.
 *
 * - generateItemDescription - A function that handles the item description generation process.
 * - GenerateItemDescriptionInput - The input type for the generateItemDescription function.
 * - GenerateItemDescriptionOutput - The return type for the generateItemDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const GenerateItemDescriptionInputSchema = z.object({
  category: z.string().describe('The main category of the item (e.g., "Electronics", "Clothing", "Wallet").'),
  keywords: z.string().describe('A few keywords or a brief phrase describing the item.'),
  additionalDetails: z.string().optional().describe('Any other specific details, unique identifiers, or conditions of the item.'),
});
export type GenerateItemDescriptionInput = z.infer<typeof GenerateItemDescriptionInputSchema>;

// Output Schema
const GenerateItemDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and comprehensive description of the item, suitable for lost and found listings.'),
});
export type GenerateItemDescriptionOutput = z.infer<typeof GenerateItemDescriptionOutputSchema>;

// Wrapper function
export async function generateItemDescription(input: GenerateItemDescriptionInput): Promise<GenerateItemDescriptionOutput> {
  return generateItemDescriptionFlow(input);
}

// Genkit Prompt Definition
const generateItemDescriptionPrompt = ai.definePrompt({
  name: 'generateItemDescriptionPrompt',
  input: {schema: GenerateItemDescriptionInputSchema},
  output: {schema: GenerateItemDescriptionOutputSchema},
  prompt: `You are an AI assistant designed to generate clear, concise, and comprehensive descriptions for lost or found items.
Your goal is to provide a detailed description that helps identify the item accurately and consistently, ensuring all important information is captured.

Based on the following information, generate a detailed description of the item:

Category: {{{category}}}
Keywords: {{{keywords}}}
{{#if additionalDetails}}
Additional Details: {{{additionalDetails}}}
{{/if}}

Please ensure the description is professional, thorough, and easy to understand. The output should be a JSON object with a single field 'description'.`,
});

// Genkit Flow Definition
const generateItemDescriptionFlow = ai.defineFlow(
  {
    name: 'generateItemDescriptionFlow',
    inputSchema: GenerateItemDescriptionInputSchema,
    outputSchema: GenerateItemDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await generateItemDescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate item description.');
    }
    return output;
  }
);
