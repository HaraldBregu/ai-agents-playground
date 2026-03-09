import { Annotation, StateGraph } from '@langchain/langgraph';
import { continueWritingNode } from './nodes/continue_writing/continue-writing-node';
import { suggestionNextNode } from './nodes/suggestion_next/suggestion-next-node';

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
  contentLength: Annotation<string>({
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
    .addNode('suggestion_next', suggestionNextNode)
    .addConditionalEdges('__start__', routeByType, [
      'continue_writing',
      'suggestion_next',
    ])
    .addEdge('continue_writing', '__end__')
    .addEdge('suggestion_next', '__end__');

  return graph.compile();
}
