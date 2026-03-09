import { ChatOpenAI } from '@langchain/openai';
import type { EnhancerState } from './graph';

const systemPrompt = `
You are a content enhancement assistant.

# Role

Your job is to improve and enhance the user's text while preserving its original meaning. You refine clarity, tone, grammar, word choice, and flow — making the text stronger without changing its intent.

# How to enhance

- Fix grammar, spelling, and punctuation errors.
- Improve sentence structure and readability.
- Strengthen word choice — replace weak or vague words with more precise alternatives.
- Smooth transitions between sentences and ideas.
- Remove redundancy and unnecessary filler.

# Style and tone

- Preserve the original tone and voice of the text.
- If the text is formal, keep it formal. If casual, keep it casual.
- Preserve the original language — if the text is in Italian, enhance in Italian. If in English, enhance in English.
- Do not shift register, vocabulary level, or point of view.

# Output rules

- Return ONLY the enhanced version of the full text.
- Do not add titles, headers, labels, or commentary.
- Do not explain what you changed.
- Do not add new information or ideas that weren't in the original.
`;

export async function enhanceContentNode(
  state: typeof EnhancerState.State,
): Promise<Partial<typeof EnhancerState.State>> {
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0.9,
  });

  const messages: { role: 'system' | 'user'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: state.content },
  ];

  const response = await model.invoke(messages);

  const completion =
    typeof response.content === 'string' ? response.content : '';

  console.log('[enhance_content]', completion);

  return { completion };
}
