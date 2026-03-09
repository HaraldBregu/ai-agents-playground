import { ChatOpenAI } from '@langchain/openai';
import type { ContinuationState } from './graph';

export async function writerNode(
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
        'Fix only grammar, spelling, and punctuation errors.',
        'Do not change capitalization unless it is clearly a grammatical error (e.g. a proper noun or the word "I").',
        'Before continuing, check if the input ends with proper punctuation (period, question mark, or exclamation mark). If not, complete the current sentence first with correct punctuation, then continue.',
        'Respond only with the continuation.',
      ].join(' '),
    },
    { role: 'user', content: state.inputText },
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

  console.log('[writer]', continuation);

  return { continuation };
}
