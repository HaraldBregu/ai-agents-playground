import { Annotation, StateGraph } from '@langchain/langgraph';
import { writerNode } from './writer-node';

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
    .addEdge('__start__', 'writer')
    .addEdge('writer', '__end__');

  return graph.compile();
}
