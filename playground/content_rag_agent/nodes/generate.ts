import { ChatOpenAI } from '@langchain/openai';
import type { RagState } from '../graph';

const systemPrompt = `You are a knowledgeable assistant that answers questions based strictly on the provided context.

# Rules

- Answer ONLY using the information in the provided context.
- If the context does not contain enough information to answer, say so clearly.
- Be concise and direct.
- Do not make up facts or add information beyond what the context provides.
- When relevant, cite specific details (numbers, dates, names) from the context.`;

export async function generateNode(
  state: typeof RagState.State,
): Promise<Partial<typeof RagState.State>> {
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0.3,
  });

  const contextBlock = state.context
    .map((chunk, i) => `[${i + 1}] ${chunk}`)
    .join('\n\n---\n\n');

  const response = await model.invoke([
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Context:\n${contextBlock}\n\nQuestion: ${state.question}`,
    },
  ]);

  const answer =
    typeof response.content === 'string' ? response.content : '';

  console.log('[generate]', answer);

  return { answer };
}
