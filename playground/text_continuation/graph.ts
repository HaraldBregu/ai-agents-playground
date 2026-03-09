import { Annotation, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';

const ContinuationState = Annotation.Root({
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

async function writerNode(
  state: typeof ContinuationState.State,
): Promise<Partial<typeof ContinuationState.State>> {
  const model = new ChatOpenAI({ model: 'gpt-4o', temperature: 0.7 });

  const prompt = state.evaluationFeedback
    ? `Continue this text naturally. Previous feedback: ${state.evaluationFeedback}\n\nText:\n${state.inputText}`
    : `Continue this text naturally in 200-400 words:\n\n${state.inputText}`;

  const response = await model.invoke([{ role: 'user', content: prompt }]);
  const continuation =
    typeof response.content === 'string' ? response.content : '';

  return { continuation };
}

async function evaluatorNode(
  state: typeof ContinuationState.State,
): Promise<Partial<typeof ContinuationState.State>> {
  const model = new ChatOpenAI({ model: 'gpt-4o', temperature: 0 });

  const prompt = `Rate this continuation on a scale of 0-10 for coherence, style consistency, quality, and flow.

Original text:
${state.inputText}

Continuation:
${state.continuation}

Respond with ONLY a JSON object: {"score": <number>, "feedback": "<one sentence>"}`;

  const response = await model.invoke([{ role: 'user', content: prompt }]);
  const text = typeof response.content === 'string' ? response.content : '';

  try {
    const parsed = JSON.parse(text);
    return {
      evaluationScore: parsed.score,
      evaluationFeedback: parsed.feedback,
      passed: parsed.score >= 7,
    };
  } catch {
    return { evaluationScore: 5, evaluationFeedback: text, passed: false };
  }
}

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
