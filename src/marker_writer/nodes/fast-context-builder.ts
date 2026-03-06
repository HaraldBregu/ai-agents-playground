import type { WriterStateValue } from '@/marker_writer/state';
import { countWords } from '@/marker_writer/helpers';

function inferContentType(text: string): string {
  if (/^#{1,2}\s+/m.test(text) && countWords(text) > 500) return 'ARTICLE';
  if (/^Dear\s|^Hi\s|^Hello\s/i.test(text.trim())) return 'EMAIL';
  if (/^\d+\.\s/m.test(text)) return 'TECHNICAL';
  if (/^(INT\.|EXT\.)/m.test(text)) return 'SCRIPT';
  if (countWords(text) < 300) return 'SOCIAL_POST';
  return 'BLOG_POST';
}

function detectPointOfView(text: string): string {
  const first = (text.match(/\b(I|we|my|our|me|us)\b/gi) || []).length;
  const second = (text.match(/\b(you|your|yours)\b/gi) || []).length;
  const third = (text.match(/\b(he|she|they|it|his|her|their|its)\b/gi) || [])
    .length;
  if (first >= second && first >= third) return 'first person';
  if (second >= first && second >= third) return 'second person';
  return 'third person';
}

function detectTense(text: string): string {
  const past = (text.match(/\b(was|were|had|did|went|said|made)\b/gi) || [])
    .length;
  const present = (text.match(/\b(is|are|has|does|goes|says|makes)\b/gi) || [])
    .length;
  if (past > present * 1.5) return 'past';
  if (present > past * 1.5) return 'present';
  return 'mixed';
}

function computeAvgSentenceLength(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length === 0) return 15;
  const totalWords = sentences.reduce(
    (sum, s) => sum + countWords(s.trim()),
    0,
  );
  return Math.round(totalWords / sentences.length);
}

// Deterministic node — zero LLM calls.
// Builds intent, style, and plan from parsed signals for simple CONTINUE operations.
export async function fastContextBuilderNode(
  state: WriterStateValue,
): Promise<Partial<WriterStateValue>> {
  const p = state.parsedInput;
  const sampleText = p.immediateBefore || p.immediateAfter;

  const intentAnalysis = {
    contentType: inferContentType(p.textBefore + p.textAfter),
    writingIntent: 'CONTINUE',
    topic: p.currentHeading || 'continuation of existing text',
    audience: 'same as existing text',
    desiredTone: 'match existing',
    desiredLength: `~${Math.min(300, Math.max(100, Math.round(p.documentWordCount * 0.15)))} words`,
    keyMessage: 'continue the current train of thought',
    constraints: [
      'match existing voice exactly',
      'do not repeat earlier content',
      p.isInsideSentence ? 'complete the current sentence first' : '',
    ].filter(Boolean),
  };

  const styleProfile = {
    tone: 'match existing',
    avgSentenceLength: computeAvgSentenceLength(sampleText),
    paragraphStyle: 'mixed' as string,
    vocabulary: 'match existing',
    pointOfView: detectPointOfView(sampleText),
    tense: detectTense(sampleText),
    notablePatterns: [] as string[],
  };

  const targetWords = Math.min(
    300,
    Math.max(100, Math.round(p.documentWordCount * 0.15)),
  );

  const writingPlan = {
    approach: 'Continue naturally from the final sentence',
    topics: [p.currentHeading].filter(Boolean),
    transitionIn: p.lastSentenceBefore,
    transitionOut: '',
    constraints: ['do not repeat content already written'],
    targetWords,
  };

  return { intentAnalysis, styleProfile, writingPlan };
}
