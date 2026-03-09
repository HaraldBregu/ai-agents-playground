import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ChatOpenAI } from '@langchain/openai';
import type { WriterState } from './graph';

const __dirname = dirname(fileURLToPath(import.meta.url));
const systemPrompt = readFileSync(
  join(__dirname, 'instructions', 'CONTENT_WRITER_AGENT.md'),
  'utf-8',
).trim();

export async function writerNode(
  state: typeof WriterState.State,
): Promise<Partial<typeof WriterState.State>> {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0.7,
  });

  const response = await model.invoke([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: state.inputText },
  ]);

  const completion =
    typeof response.content === 'string' ? response.content : '';

  console.log('[writer]', completion);

  return { completion };
}
