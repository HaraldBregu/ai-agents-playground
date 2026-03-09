import { ChatOpenAI } from '@langchain/openai';
import type { ContinuationState } from './graph';

export async function grammarNode(
  state: typeof ContinuationState.State,
): Promise<Partial<typeof ContinuationState.State>> {
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0,
  });

  const response = await model.invoke([
    {
      role: 'system',
      content: [
        'You are a grammar correction assistant.',
        'Fix any grammar, spelling, and punctuation errors in the text.',
        'Do not change the meaning, tone, or style.',
        'Respond only with the corrected text.',
      ].join(' '),
    },
    { role: 'user', content: state.continuation },
  ]);

  const continuation =
    typeof response.content === 'string' ? response.content : '';

  console.log('[grammar]', continuation);

  return { continuation };
}
