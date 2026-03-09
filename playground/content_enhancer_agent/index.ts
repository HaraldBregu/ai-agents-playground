import dotenv from 'dotenv';
dotenv.config();

import { parseArgs } from 'util';
import { createEnhancerGraph } from './graph';
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

  const start = Date.now();
  const graph = createEnhancerGraph();

  console.log('INPUT:', input);
  process.stdout.write('\nOUTPUT: ');

  let completion = '';
  const stream = await graph.stream(
    { inputText: input, content: input },
    { streamMode: 'updates' },
  );

  for await (const event of stream) {
    const nodeOutput = event.enhance_content;
    if (nodeOutput?.completion) {
      completion = nodeOutput.completion;
      process.stdout.write(completion);
    }
  }

  process.stdout.write('\n');

  saveResult(import.meta.filename, {
    model: 'gpt-4o',
    temperature: 0.9,
    messages: [{ role: 'user', content: input }],
    response: completion,
    durationMs: Date.now() - start,
  });
}

main().catch(console.error);
