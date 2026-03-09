import dotenv from 'dotenv';
dotenv.config();

import { parseArgs } from 'util';
import { createContinuationGraph } from './graph';
import { saveResult } from '../save-result';

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string', short: 'i' },
      'max-iterations': { type: 'string' },
      verbose: { type: 'boolean', short: 'v' },
    },
  });

  const input = values.input ?? '';
  const maxIterations = values['max-iterations']
    ? parseInt(values['max-iterations'])
    : 3;

  if (!input) {
    console.error('Provide --input');
    process.exit(1);
  }

  const graph = createContinuationGraph();

  const start = Date.now();
  const result = await graph.invoke({ inputText: input, maxIterations });

  if (values.verbose) {
    console.log('SCORE:', result.evaluationScore);
    console.log('FEEDBACK:', result.evaluationFeedback);
    console.log('ITERATIONS:', result.iteration);
    console.log('PASSED:', result.passed);
    console.log('---');
  }

  console.log('INPUT:', input);
  console.log('\nOUTPUT:', result.continuation);

  saveResult(import.meta.filename, {
    model: 'gpt-4o',
    temperature: 0.7,
    messages: [{ role: 'user', content: input }],
    response: result.continuation,
    durationMs: Date.now() - start,
  });
}

main().catch(console.error);
