import dotenv from 'dotenv';
dotenv.config();

import { parseArgs } from 'util';
import { createRagGraph } from './graph';
import { saveResult } from '../save-result';

async function main() {
  const { values } = parseArgs({
    options: {
      question: { type: 'string', short: 'q' },
    },
  });

  const question = values.question ?? '';

  if (!question) {
    console.error('Provide --question');
    process.exit(1);
  }

  const start = Date.now();
  const graph = createRagGraph();
  const result = await graph.invoke({ question });

  console.log('QUESTION:', question);
  console.log('\nCONTEXT CHUNKS:', result.context.length);
  console.log('\nANSWER:', result.answer);

  saveResult(import.meta.filename, {
    model: 'gpt-4o',
    temperature: 0.3,
    messages: [{ role: 'user', content: question }],
    response: result.answer,
    durationMs: Date.now() - start,
  });
}

main().catch(console.error);
