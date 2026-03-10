import { Annotation, StateGraph } from '@langchain/langgraph';
import { retrieveNode } from './nodes/retrieve';
import { generateNode } from './nodes/generate';

export const RagState = Annotation.Root({
  question: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  context: Annotation<string[]>({
    reducer: (_a, b) => b,
    default: () => [],
  }),
  answer: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
});

export function createRagGraph() {
  const graph = new StateGraph(RagState)
    .addNode('retrieve', retrieveNode)
    .addNode('generate', generateNode)
    .addEdge('__start__', 'retrieve')
    .addEdge('retrieve', 'generate')
    .addEdge('generate', '__end__');

  return graph.compile();
}
