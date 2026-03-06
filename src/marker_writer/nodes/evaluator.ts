import type { WriterStateValue } from '@/marker_writer/state';
import { createReviewerModel } from '@/marker_writer/models';

export async function evaluatorNode(
  state: WriterStateValue,
): Promise<Partial<WriterStateValue>> {
  const p = state.parsedInput;
  const generated = state.generatedText;

  const model = createReviewerModel();

  const needsAfterCheck = ['BRIDGE', 'PREPEND', 'FILL_SECTION'].includes(
    p.operationType,
  );

  const response = await model.invoke([
    {
      role: 'system' as const,
      content: `You are a writing quality evaluator. Check the generated text for:

1. SEAM COHERENCE (before): Does it flow naturally from the preceding text?
   Last sentence before: "${p.lastSentenceBefore}"

${needsAfterCheck ? `2. SEAM COHERENCE (after): Does it connect naturally to the following text?\n   First sentence after: "${p.firstSentenceAfter}"` : '2. SEAM COHERENCE (after): N/A — no text follows.'}

3. VOICE MATCH: Does vocabulary, sentence length, and tense match the surrounding text?
   Style profile: tone=${state.styleProfile.tone}, avgSentenceLength=${state.styleProfile.avgSentenceLength}, POV=${state.styleProfile.pointOfView}, tense=${state.styleProfile.tense}

4. NO REPETITION: Does the generated text avoid repeating phrases from the immediate context?

Respond with ONLY valid JSON:
{
  "pass": true | false,
  "issues": ["issue description if any"],
  "retryInstruction": "specific fix instruction for the writer, or empty string if pass"
}`,
    },
    {
      role: 'user' as const,
      content:
        `CONTEXT BEFORE:\n"${p.immediateBefore.slice(-300)}"\n\n` +
        `GENERATED TEXT:\n"${generated}"\n\n` +
        `CONTEXT AFTER:\n"${p.immediateAfter.slice(0, 300) || '(end of document)'}"`,
    },
  ] as any);

  const raw = (response.content as string)
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
  const result = JSON.parse(raw);

  if (result.pass) {
    return { evaluatorFeedback: '', retryCount: state.retryCount ?? 0 };
  }

  return {
    evaluatorFeedback: result.retryInstruction || result.issues?.join('; '),
    retryCount: (state.retryCount ?? 0) + 1,
  };
}
