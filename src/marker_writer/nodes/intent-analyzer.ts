import type { WriterStateValue } from '@/marker_writer/state';
import { createUnderstandingModel } from '@/marker_writer/models';

export async function intentAnalyzerNode(
  state: WriterStateValue,
): Promise<Partial<WriterStateValue>> {
  const p = state.parsedInput;
  const model = createUnderstandingModel();

  const response = await model.invoke([
    {
      role: 'system' as const,
      content: `Analyze what the user wants written. You have precise information about
       where in the document they want content.

       MARKER ANALYSIS:
       Position: ${p.markerPosition}
       Operation: ${p.operationType}
       Inside sentence: ${p.isInsideSentence}
       Inside paragraph: ${p.isInsideParagraph}
       Current section: "${p.currentHeading}"
       Next section: "${p.nextHeading}"
       Document length: ${p.documentWordCount} words
       Text before marker: ${p.totalCharsBefore} chars
       Text after marker: ${p.totalCharsAfter} chars

       IMMEDIATE CONTEXT:
       Before: "${p.immediateBefore.slice(-200)}"
       After: "${p.immediateAfter.slice(0, 200)}"

       USER INSTRUCTION: "${state.userInstruction || '(none — just continue)'}"

       Respond with ONLY valid JSON:
       {
         "contentType": "ARTICLE | BLOG_POST | ESSAY | STORY | etc.",
         "writingIntent": "what the user wants to achieve",
         "topic": "the subject to write about",
         "audience": "who will read this",
         "desiredTone": "tone to use",
         "desiredLength": "how much to write",
         "keyMessage": "the core message",
         "constraints": ["constraint1", "constraint2"]
       }`,
    },
    {
      role: 'user' as const,
      content:
        `Full text before marker:\n${p.textBefore.slice(-1000)}\n\n` +
        `Full text after marker:\n${p.textAfter.slice(0, 1000)}`,
    },
  ] as any);

  const raw = (response.content as string)
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
  return { intentAnalysis: JSON.parse(raw) };
}
