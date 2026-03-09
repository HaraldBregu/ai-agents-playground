import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Annotation, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const systemPrompt = readFileSync(
  join(__dirname, 'instructions', 'CONTENT_WRITER_AGENT.md'),
  'utf-8',
).trim();

export const WriterState = Annotation.Root({
  inputText: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  completion: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
});

async function writerNode(
  state: typeof WriterState.State,
): Promise<Partial<typeof WriterState.State>> {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0.7,
  });

  const response = await model.invoke([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: state.inputText },
  ]);

  const completion =
    typeof response.content === 'string' ? response.content : '';

  console.log('[writer]', completion);

  return { completion };
}

export function createWriterGraph() {
  const graph = new StateGraph(WriterState)
    .addNode('writer', writerNode)
    .addEdge('__start__', 'writer')
    .addEdge('writer', '__end__');

  return graph.compile();
}
