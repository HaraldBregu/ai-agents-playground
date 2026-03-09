import { Annotation, StateGraph } from '@langchain/langgraph';
import { intentNode } from './nodes/intent-node';
import { continueWritingNode } from './nodes/continue-writing-node';
import { continueWritingNewParagraphNode } from './nodes/continue-writing-new-paragraph-node';
import { createNewSectionNode } from './nodes/create-new-section-node';
import { summarizeNode } from './nodes/summarize-node';
import { rewriteNode } from './nodes/rewrite-node';
import { expandNode } from './nodes/expand-node';

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

function routeByIntent(state: typeof WriterState.State): string {
  const routes: Record<string, string> = {
    continue_writing: 'continue_writing',
    continue_writing_new_paragraph: 'continue_writing_new_paragraph',
    create_new_section: 'create_new_section',
    summarize: 'summarize',
    rewrite: 'rewrite',
    expand: 'expand',
  };

  return routes[state.intent] ?? 'continue_writing';
}

export function createWriterGraph() {
  const graph = new StateGraph(WriterState)
    .addNode('intent_resolver', intentNode)
    .addNode('continue_writing', continueWritingNode)
    .addNode('continue_writing_new_paragraph', continueWritingNewParagraphNode)
    .addNode('create_new_section', createNewSectionNode)
    .addNode('summarize', summarizeNode)
    .addNode('rewrite', rewriteNode)
    .addNode('expand', expandNode)
    .addEdge('__start__', 'intent_resolver')
    .addConditionalEdges('intent_resolver', routeByIntent, [
      'continue_writing',
      'continue_writing_new_paragraph',
      'create_new_section',
      'summarize',
      'rewrite',
      'expand',
    ])
    .addEdge('continue_writing', '__end__')
    .addEdge('continue_writing_new_paragraph', '__end__')
    .addEdge('create_new_section', '__end__')
    .addEdge('summarize', '__end__')
    .addEdge('rewrite', '__end__')
    .addEdge('expand', '__end__');

  return graph.compile();
}
