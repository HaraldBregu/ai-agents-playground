import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ChatOpenAI } from '@langchain/openai';
import type { WriterState } from '../../graph';

const __dirname = dirname(fileURLToPath(import.meta.url));
const systemPrompt = readFileSync(
  join(__dirname, 'INTENT_RESOLVER.md'),
  'utf-8',
).trim();

export async function intentNode(
  state: typeof WriterState.State,
): Promise<Partial<typeof WriterState.State>> {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
  });

  let userMessage = '';

  userMessage += `<content>${state.inputText}</content>`;

  const response = await model.invoke([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ]);

  const raw = typeof response.content === 'string' ? response.content : '';

  try {
    const parsed = JSON.parse(raw);
    console.log('[intent]', parsed);

    return {
      intent: parsed.intent ?? 'continue_writing',
      content: parsed.content ?? state.inputText,
      constraints: parsed.constraints ?? null,
    };
  } catch {
    console.log('[intent] failed to parse, using defaults');

    return {
      intent: 'continue_writing',
      content: state.inputText,
      constraints: null,
    };
  }
}
