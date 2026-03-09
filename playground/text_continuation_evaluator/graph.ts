import { Annotation, StateGraph } from '@langchain/langgraph';
import { writerNode } from './writer-node';
import { evaluatorNode } from './evaluator-node';

export const ContinuationState = Annotation.Root({
  inputText: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  continuation: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  evaluationScore: Annotation<number>({
    reducer: (_a, b) => b,
    default: () => 0,
  }),
  evaluationFeedback: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  passed: Annotation<boolean>({
    reducer: (_a, b) => b,
    default: () => false,
  }),
  iteration: Annotation<number>({
    reducer: (a, b) => (b ?? a) + 1,
    default: () => 0,
  }),
  maxIterations: Annotation<number>({
    reducer: (_a, b) => b,
    default: () => 3,
  }),
});

function routeAfterEvaluation(
  state: typeof ContinuationState.State,
): 'writer' | '__end__' {
  if (state.passed) return '__end__';
  if (state.iteration >= state.maxIterations) return '__end__';
  return 'writer';
}

export function createContinuationGraph() {
  const graph = new StateGraph(ContinuationState)
    .addNode('writer', writerNode)
    .addNode('evaluator', evaluatorNode)
    .addEdge('__start__', 'writer')
    .addEdge('writer', 'evaluator')
    .addConditionalEdges('evaluator', routeAfterEvaluation);

  return graph.compile();
}
