import dotenv from 'dotenv';
dotenv.config();

import { parseArgs } from 'util';
import { createCompleterGraph } from './graph';
import { saveResult } from '../save-result';

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string', short: 'i' },
    },
  });

  const input = values.input ?? '';

  if (!input) {
    console.error('Provide --input');
    process.exit(1);
  }

  const graph = createCompleterGraph();

  const start = Date.now();
  const result = await graph.invoke({ inputText: input });

  console.log('INPUT:', input);
  console.log('\nOUTPUT:', result.completion);

  saveResult(import.meta.filename, {
    model: 'gpt-4o',
    temperature: 0.7,
    messages: [{ role: 'user', content: input }],
    response: result.completion,
    durationMs: Date.now() - start,
  });
}

main().catch(console.error);
