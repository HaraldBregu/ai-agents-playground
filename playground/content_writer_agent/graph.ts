import { Annotation, StateGraph } from '@langchain/langgraph';
import { intentNode } from './intent-node';
import { writerNode } from './writer-node';

export const WriterState = Annotation.Root({
  inputText: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  intent: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  content: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  constraints: Annotation<string | null>({
    reducer: (_a, b) => b,
    default: () => null,
  }),
  completion: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
});

export function createWriterGraph() {
  const graph = new StateGraph(WriterState)
    .addNode('intent', intentNode)
    .addNode('writer', writerNode)
    .addEdge('__start__', 'intent')
    .addEdge('intent', 'writer')
    .addEdge('writer', '__end__');

  return graph.compile();
}
