import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Annotation, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const systemPrompt = readFileSync(
  join(__dirname, 'instructions', 'TEXT_CONTINUATION.md'),
  'utf-8',
).trim();

export const CompleterState = Annotation.Root({
  inputText: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  completion: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
});

async function completerNode(
  state: typeof CompleterState.State,
): Promise<Partial<typeof CompleterState.State>> {
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

  console.log('[completer]', completion);

  return { completion };
}

export function createCompleterGraph() {
  const graph = new StateGraph(CompleterState)
    .addNode('completer', completerNode)
    .addEdge('__start__', 'completer')
    .addEdge('completer', '__end__');

  return graph.compile();
}
