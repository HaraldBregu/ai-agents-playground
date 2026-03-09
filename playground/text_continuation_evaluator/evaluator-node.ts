import { ChatOpenAI } from '@langchain/openai';
import type { ContinuationState } from './graph';

export async function evaluatorNode(
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
        'You are a writing evaluator.',
        'Rate the continuation on a scale of 0-10 for coherence, style consistency, quality, and flow.',
        'Respond with ONLY a JSON object: {"score": <number>, "feedback": "<one sentence>"}',
      ].join(' '),
    },
    {
      role: 'user',
      content: `Original text:\n${state.inputText}\n\nContinuation:\n${state.continuation}`,
    },
  ]);

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
