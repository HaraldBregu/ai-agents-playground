import { Annotation, StateGraph } from '@langchain/langgraph';
import { enhanceContentNode } from './node';

export const EnhancerState = Annotation.Root({
  inputText: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  content: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  completion: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
});

export function createEnhancerGraph() {
  const graph = new StateGraph(EnhancerState)
    .addNode('enhance_content', enhanceContentNode)
    .addEdge('__start__', 'enhance_content')
    .addEdge('enhance_content', '__end__');

  return graph.compile();
}
