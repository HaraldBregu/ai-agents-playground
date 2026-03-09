import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ChatOpenAI } from '@langchain/openai';
import type { WriterState } from '../../graph';

const __dirname = dirname(fileURLToPath(import.meta.url));
const systemPrompt = readFileSync(
  join(__dirname, 'CONTINUE_WRITING.md'),
  'utf-8',
).trim();

const lengthPrompts: Record<string, string> = {
  short: readFileSync(join(__dirname, 'SHORT_CONTINUATION.md'), 'utf-8').trim(),
  long: readFileSync(join(__dirname, 'LONG_CONTINUATION.md'), 'utf-8').trim(),
};

export async function continueWritingNode(
  state: typeof WriterState.State,
): Promise<Partial<typeof WriterState.State>> {
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0.7,
  });

  const lengthInstruction = lengthPrompts[state.contentLength] ?? '';

  const messages: { role: 'system' | 'user'; content: string }[] = [
    { role: 'system', content: systemPrompt },
  ];

  if (lengthInstruction) {
    messages.push({ role: 'system', content: lengthInstruction });
  }

  messages.push({
    role: 'user',
    content: `<content>${state.content}</content>`,
  });

  const response = await model.invoke(messages);

  const completion =
    typeof response.content === 'string' ? response.content : '';

  console.log('[continue_writing]', completion);

  return { completion };
}
