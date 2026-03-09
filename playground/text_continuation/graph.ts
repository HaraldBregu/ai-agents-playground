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
});

async function writerNode(
  state: typeof ContinuationState.State,
): Promise<Partial<typeof ContinuationState.State>> {
  const model = new ChatOpenAI({ model: 'gpt-4o', temperature: 0.7 });

  const response = await model.invoke([
    {
      role: 'user',
      content: `Continue this text naturally in 200-400 words:\n\n${state.inputText}`,
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
