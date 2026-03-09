import { ChatOpenAI } from '@langchain/openai';
import type { ContinuationState } from './graph';

export async function writerNode(
  state: typeof ContinuationState.State,
): Promise<Partial<typeof ContinuationState.State>> {
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0.7,
  });

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] =
    [
      {
        role: 'system',
        content: [
          'You are a writing assistant.',
          'When given text, continue it naturally while matching the tone, style, and subject.',
          'Do not repeat the input.',
          'Respond only with the continuation.',
        ].join(' '),
      },
      { role: 'user', content: state.inputText },
    ];

  if (state.evaluationFeedback) {
    messages.push({
      role: 'assistant',
      content: `Previous attempt was rejected. Feedback: ${state.evaluationFeedback}. Try again.`,
    });
  } else {
    messages.push({
      role: 'assistant',
      content: [
        'Continue the writing naturally.',
        'Respond with maximum 5-10 words.',
      ].join(' '),
    });
  }

  const response = await model.invoke(messages);

  const continuation =
    typeof response.content === 'string' ? response.content : '';

  return { continuation };
}
