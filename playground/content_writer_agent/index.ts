import dotenv from 'dotenv';
dotenv.config();

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'util';
import { ChatOpenAI } from '@langchain/openai';
import { createWriterGraph } from './graph';
import { saveResult } from '../save-result';

const __dirname = dirname(fileURLToPath(import.meta.url));
const streamPrompt = readFileSync(
  join(__dirname, 'nodes', 'continue_writing', 'CONTINUE_WRITING.md'),
  'utf-8',
).trim();

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string', short: 'i' },
      type: { type: 'string', short: 't' },
    },
  });

  const input = values.input ?? '';

  if (!input) {
    console.error('Provide --input');
    process.exit(1);
  }

  const messages: { role: 'system' | 'user'; content: string }[] = [
    { role: 'system', content: streamPrompt },
    { role: 'user', content: input },
  ];

  const start = Date.now();
  let completion = '';

  if (values.stream) {
    const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 });
    const stream = await model.stream(messages);
    for await (const chunk of stream) {
      const text = typeof chunk.content === 'string' ? chunk.content : '';
      process.stdout.write(text);
      completion += text;
    }
    console.log();
  } else {
    const graph = createWriterGraph();
    const result = await graph.invoke({ inputText: input });
    completion = result.completion;
    console.log('INPUT:', input);
    console.log('\nOUTPUT:', completion);
  }

  saveResult(import.meta.filename, {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages,
    response: completion,
    durationMs: Date.now() - start,
  });
}

main().catch(console.error);
