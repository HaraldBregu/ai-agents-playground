import dotenv from 'dotenv';
dotenv.config();

import { createMarkerWriterGraph } from '@/marker_writer/graph';

async function main() {
  const app = createMarkerWriterGraph();

  console.log('\n=== Continue text ===');
  const r1 = await app.invoke(
    {
      rawInput:
        'The history of coffee begins in Ethiopia, where legend says a goat herder named Kaldi noticed his goats dancing after eating berries from a certain tree.',
      userInstruction: '',
    },
    { configurable: { thread_id: 'p1' } },
  );
  console.log('Generated:', r1.generatedText.slice(0, 200) + '...');

  console.log('\n=== Generate from instruction ===');
  const r2 = await app.invoke(
    {
      rawInput: '',
      userInstruction: 'write a blog post about sustainable urban farming',
    },
    { configurable: { thread_id: 'p2' } },
  );
  console.log('Generated:', r2.generatedText.slice(0, 200) + '...');
}

main().catch(console.error);
