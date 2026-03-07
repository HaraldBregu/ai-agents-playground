import { ChatOpenAI } from '@langchain/openai';
import { config } from '@/config';
import type { WritingStateValue } from '@/state';

export async function writerNode(
  state: WritingStateValue,
): Promise<Partial<WritingStateValue>> {
  const model = new ChatOpenAI({
    model: config.model,
    temperature: config.writerTemperature,
  });

  const prompt = `Continue this text naturally in ${config.continuationLength}:\n\n${state.inputText}`;

  const response = await model.invoke([{ role: 'user', content: prompt }]);
  const continuation =
    typeof response.content === 'string' ? response.content : '';

  return { continuation };
}
