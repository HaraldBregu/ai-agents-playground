import { Annotation } from '@langchain/langgraph';

export const WritingState = Annotation.Root({
  inputText: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => '',
  }),
  continuation: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => '',
  }),
});

export type WritingStateValue = typeof WritingState.State;
