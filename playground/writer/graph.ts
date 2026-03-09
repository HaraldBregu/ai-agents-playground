import { Annotation, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';

const WritingState = Annotation.Root({
  inputText: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  instruction: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
  generatedText: Annotation<string>({
    reducer: (_a, b) => b,
    default: () => '',
  }),
});

async function writerNode(
  state: typeof WritingState.State,
): Promise<Partial<typeof WritingState.State>> {
  const model = new ChatOpenAI({ model: 'gpt-4o', temperature: 0.7 });

  const response = await model.invoke([
    { role: 'user', content: state.inputText },
  ]);

  const generatedText =
    typeof response.content === 'string' ? response.content : '';

  return { generatedText };
}

export function createWritingGraph() {
  const graph = new StateGraph(WritingState)
    .addNode('writer', writerNode)
    .addEdge('__start__', 'writer')
    .addEdge('writer', '__end__');

  return graph.compile();
}
