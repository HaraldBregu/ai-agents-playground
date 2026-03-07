import dotenv from 'dotenv';
dotenv.config();

import { program } from 'commander';
import { readFileSync } from 'fs';
import { createWritingGraph } from '@/graph';

async function runWritingAgent(inputText: string): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('Atlas');
  console.log('='.repeat(60) + '\n');

  const graph = createWritingGraph();

  console.log(`[system] Input text length: ${inputText.length} characters\n`);

  try {
    const result = await graph.invoke({ inputText: inputText.trim() });

    console.log('ORIGINAL TEXT:\n');
    console.log(result.inputText);
    console.log('\n' + '-'.repeat(60) + '\n');
    console.log('GENERATED CONTINUATION:\n');
    console.log(result.continuation);
    console.log('\n' + '='.repeat(60) + '\n');
  } catch (error) {
    console.error('\n[error] Failed to generate continuation:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

program
  .name('atlas')
  .description('AI writing agent')
  .version('1.0.0');

program
  .option('--input <text>', 'Input text to continue')
  .option('--file <path>', 'Read input from file');

program.parse();

const options = program.opts();

async function main(): Promise<void> {
  let inputText: string | null = null;

  if (options.input) {
    inputText = options.input as string;
  } else if (options.file) {
    try {
      inputText = readFileSync(options.file as string, 'utf-8');
    } catch (error) {
      console.error(`Error reading file: ${(error as Error).message}`);
      process.exit(1);
    }
  } else {
    console.log('No input provided. Use --help for usage instructions.');
    console.log('\nExamples:');
    console.log('  npx tsx src/index.ts --input "Your text here..."');
    console.log('  npx tsx src/index.ts --file input.txt');
    process.exit(1);
  }

  if (inputText) {
    await runWritingAgent(inputText);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
