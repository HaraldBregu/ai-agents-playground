import { Annotation, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';

export const CompleterState = Annotation.Root({
  inputText: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  completion: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
});

async function completerNode(
  state: typeof CompleterState.State,
): Promise<Partial<typeof CompleterState.State>> {
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0.7,
  });

  const response = await model.invoke([
    {
      role: 'system',
      content: [
        'You are a sentence completion assistant.',
        'The user will provide text that may end with an incomplete word or unfinished sentence.',
        'Complete the word and/or sentence naturally.',
        'Match the tone, style, and subject of the original text.',
        'Do not repeat the input.',
        'Do not add extra sentences beyond completing the current one.',
        'Respond only with the completion.',
      ].join(' '),
    },
    { role: 'user', content: state.inputText },
  ]);

  const completion =
    typeof response.content === 'string' ? response.content : '';

  console.log('[completer]', completion);

  return { completion };
}

export function createCompleterGraph() {
  const graph = new StateGraph(CompleterState)
    .addNode('completer', completerNode)
    .addEdge('__start__', 'completer')
    .addEdge('completer', '__end__');

  return graph.compile();
}
