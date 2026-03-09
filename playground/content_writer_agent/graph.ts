import { Annotation, StateGraph } from '@langchain/langgraph';
import { writerNode } from './writer-node';

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

export function createWriterGraph() {
  const graph = new StateGraph(WriterState)
    .addNode('writer', writerNode)
    .addEdge('__start__', 'writer')
    .addEdge('writer', '__end__');

  return graph.compile();
}
