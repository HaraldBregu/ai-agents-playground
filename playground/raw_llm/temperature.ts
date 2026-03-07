import dotenv from 'dotenv';
dotenv.config();

import { ChatOpenAI } from '@langchain/openai';
import { saveResult } from '../save-result';

async function main() {
  const modelName = 'gpt-4o';
  const messages = [{ role: 'user' as const, content: 'Write one sentence about the ocean.' }];

  console.log('=== Temperature 0 (deterministic) ===');
  const cold = new ChatOpenAI({ model: modelName, temperature: 0 });
  const r1 = await cold.invoke(messages);
  const content1 = typeof r1.content === 'string' ? r1.content : '';
  console.log(content1);

  saveResult(import.meta.filename.replace('.ts', '-t0.ts'), {
    model: modelName,
    temperature: 0,
    messages,
    response: content1,
  });

  console.log('\n=== Temperature 1 (creative) ===');
  const hot = new ChatOpenAI({ model: modelName, temperature: 1 });
  const r2 = await hot.invoke(messages);
  const content2 = typeof r2.content === 'string' ? r2.content : '';
  console.log(content2);

  saveResult(import.meta.filename.replace('.ts', '-t1.ts'), {
    model: modelName,
    temperature: 1,
    messages,
    response: content2,
  });
}

main().catch(console.error);
