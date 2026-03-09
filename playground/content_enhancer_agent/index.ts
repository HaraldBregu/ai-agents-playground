import dotenv from 'dotenv';
dotenv.config();

import { parseArgs } from 'util';
import { createEnhancerGraph } from './graph';
import { saveResult } from '../save-result';

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string', short: 'i' },
      level: { type: 'string', short: 'l' },
    },
  });

  const input = values.input ?? '';
  const enhancementLevel = values.level ?? 'light';

  if (!input) {
    console.error('Provide --input');
    process.exit(1);
  }

  const start = Date.now();
  const graph = createEnhancerGraph();
  const result = await graph.invoke({
    inputText: input,
    content: input,
    enhancementLevel: enhancementLevel as 'light' | 'moderate' | 'heavy',
  });
  const completion = result.completion;

  console.log('INPUT:', input);
  console.log('LEVEL:', enhancementLevel);
  console.log('\nOUTPUT:', completion);

  saveResult(import.meta.filename, {
    model: 'gpt-4o',
    temperature: 0.7,
    messages: [{ role: 'user', content: input }],
    response: completion,
    durationMs: Date.now() - start,
  });
}

main().catch(console.error);
