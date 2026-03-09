import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ChatOpenAI } from '@langchain/openai';
import type { WriterState } from '../../graph';

const __dirname = dirname(fileURLToPath(import.meta.url));
const systemPrompt = readFileSync(
  join(__dirname, 'SUGGESTION_NEXT.md'),
  'utf-8',
).trim();

export async function suggestionNextNode(
  state: typeof WriterState.State,
): Promise<Partial<typeof WriterState.State>> {
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0.9,
  });

  let userMessage = '';
  userMessage += `<content>${state.content}</content>`;

  const response = await model.invoke([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ]);

  const completion =
    typeof response.content === 'string' ? response.content : '';

  console.log('[suggestion_next]', completion);

  return { completion };
}
