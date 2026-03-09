import dotenv from 'dotenv';
dotenv.config();

import { parseArgs } from 'util';
import { createWriterGraph } from './graph';
import { saveResult } from '../save-result';

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string', short: 'i' },
      type: { type: 'string', short: 't' },
      length: { type: 'string', short: 'l' },
    },
  });

  const input = values.input ?? '';
  const type = values.type ?? 'continue_writing';

  if (!input) {
    console.error('Provide --input');
    process.exit(1);
  }

  const start = Date.now();
  const graph = createWriterGraph();
  const result = await graph.invoke({ inputText: input, type, content: input });
  const completion = result.completion;

  console.log('INPUT:', input);
  console.log('TYPE:', type);
  console.log('\nOUTPUT:', completion);

  saveResult(import.meta.filename, {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages: [{ role: 'user', content: input }],
    response: completion,
    durationMs: Date.now() - start,
  });
}

main().catch(console.error);
