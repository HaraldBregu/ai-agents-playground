import { Annotation, StateGraph } from '@langchain/langgraph';
import { continueWritingNode } from './node';

export const WriterState = Annotation.Root({
  inputText: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  type: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => 'continue_writing',
  }),
  content: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  contentLength: Annotation<"short" | "medium" | "long">({
    reducer: (_a, b) => b,
    default: () => 'short',
  }),
  completion: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
});

function routeByType(state: typeof WriterState.State): string {
  const routes: Record<string, string> = {
    continue_writing: 'continue_writing',
    suggestion_next: 'suggestion_next',
  };

  return routes[state.type] ?? 'continue_writing';
}

export function createWriterGraph() {
  const graph = new StateGraph(WriterState)
    .addNode('continue_writing', continueWritingNode)
    .addEdge('__start__', 'continue_writing')
    .addEdge('continue_writing', '__end__')

  return graph.compile();
}
