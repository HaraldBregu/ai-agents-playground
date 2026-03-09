import { Annotation, StateGraph } from '@langchain/langgraph';
import { writerNode } from './writer-node';
import { grammarNode } from './grammar-node';

export const ContinuationState = Annotation.Root({
  inputText: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  continuation: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
});

export function createContinuationGraph() {
  const graph = new StateGraph(ContinuationState)
    .addNode('writer', writerNode)
    .addNode('grammar', grammarNode)
    .addEdge('__start__', 'writer')
    .addEdge('writer', 'grammar')
    .addEdge('grammar', '__end__');

  return graph.compile();
}
