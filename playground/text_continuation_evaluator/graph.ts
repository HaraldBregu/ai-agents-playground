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
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0.7,
  });

  const response = await model.invoke([
    {
      role: 'system',
      content: [
        'You are a writing assistant.',
        'When given text, continue it naturally while matching the tone, style, and subject.',
        'Do not repeat the input.',
        'Respond only with the continuation.',
      ].join(' '),
    },
    {
      role: 'user',
      content: state.inputText,
    },
    {
      role: 'assistant',
      content: [
        'Continue the writing naturally.',
        'Respond with maximum 5-10 words.',
      ].join(' '),
    },
  ]);

  const continuation =
    typeof response.content === 'string' ? response.content : '';

  return { continuation };
}

export function createContinuationGraph() {
  const graph = new StateGraph(ContinuationState)
    .addNode('writer', writerNode)
    .addEdge('__start__', 'writer')
    .addEdge('writer', '__end__');

  return graph.compile();
}
