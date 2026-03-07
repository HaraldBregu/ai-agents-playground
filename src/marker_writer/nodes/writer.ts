import {
  createUnderstandingModel,
  createWriterModel,
} from '@/marker_writer/models';
import type { WriterStateValue } from '@/marker_writer/state';
import type { StyleProfile } from '@/marker_writer/types';
import { countWords } from '@/marker_writer/helpers';

// ─── Style Analysis ─────────────────────────────────────────

function buildAnalysisPrompt(text: string, targetLength: number): string {
  let prompt = `Analyze the writing style of the following text.\n\n`;
  prompt += `## Inputs\n\n`;
  prompt += `### TEXT\n<text>\n${text}\n</text>\n\n`;
  prompt += `### GENERATION TARGET\n`;
  prompt += `- Requested length: ${targetLength} words\n`;
  prompt += `- Action type: CONTINUE\n\n`;
  prompt += `## Instructions\n\n`;
  prompt += `Based on the TEXT, extract the writing style. `;
  prompt += `Respond with ONLY a JSON object (no markdown fences) with these fields:\n`;
  prompt += `- "tense": the narrative tense (e.g. "past", "present")\n`;
  prompt += `- "pointOfView": the narrative POV (e.g. "third person limited (Elena)", "first person")\n`;
  prompt += `- "tone": comma-separated tone descriptors (e.g. "suspenseful, atmospheric")\n`;
  prompt += `- "formality": the writing register (e.g. "literary fiction", "casual", "academic")\n`;
  prompt += `- "genre": the genre (e.g. "dark fantasy", "sci-fi", "memoir")\n`;
  prompt += `- "notablePatterns": array of notable stylistic patterns (e.g. ["short punchy sentences", "heavy use of metaphor"])`;

  return prompt;
}

function parseStyleResponse(content: string): StyleProfile {
  const fallback: StyleProfile = {
    tense: 'past',
    pointOfView: 'third person',
    tone: 'neutral',
    formality: 'standard',
    genre: 'general',
    notablePatterns: [],
  };

  try {
    const parsed = JSON.parse(content);
    return {
      tense: parsed.tense || fallback.tense,
      pointOfView: parsed.pointOfView || fallback.pointOfView,
      tone: parsed.tone || fallback.tone,
      formality: parsed.formality || fallback.formality,
      genre: parsed.genre || fallback.genre,
      notablePatterns: parsed.notablePatterns || fallback.notablePatterns,
    };
  } catch {
    return fallback;
  }
}

async function analyzeStyle(
  text: string,
  targetLength: number,
): Promise<StyleProfile> {
  const prompt = buildAnalysisPrompt(text, targetLength);
  const model = createUnderstandingModel();
  const response = await model.invoke([{ role: 'user', content: prompt }]);
  const content = typeof response.content === 'string' ? response.content : '';
  return parseStyleResponse(content);
}

// ─── Prompt Building ────────────────────────────────────────

function formatStyleNotes(style: StyleProfile): string {
  const lines = [];
  if (style.tense) lines.push(`- Tense: ${style.tense}`);
  if (style.pointOfView) lines.push(`- POV: ${style.pointOfView}`);
  if (style.tone) lines.push(`- Tone: ${style.tone}`);
  if (style.formality) lines.push(`- Formality: ${style.formality}`);
  if (style.genre) lines.push(`- Genre: ${style.genre}`);
  if (style.notablePatterns.length > 0) {
    lines.push(`- Patterns: ${style.notablePatterns.join(', ')}`);
  }
  return lines.join('\n');
}

function buildWriterPrompt(
  text: string,
  styleProfile: StyleProfile,
  targetLength: number,
  instruction: string,
): { system: string; user: string } {
  const system =
    `You are a skilled writer. Generate text that seamlessly continues the given text.\n` +
    `Rules:\n` +
    `- Match the tone, style, and vocabulary of the existing text\n` +
    `- Output ONLY the generated text, no explanations or meta-commentary\n` +
    `- Target approximately ${targetLength} words`;

  let user = `## Inputs\n\n`;

  user += `### TEXT\n<text>\n${text}\n</text>\n\n`;

  const styleNotes = formatStyleNotes(styleProfile);
  if (styleNotes) {
    user += `### STYLE_NOTES\n<style_notes>\n${styleNotes}\n</style_notes>\n\n`;
  }

  user += `### GENERATION TARGET\n`;
  user += `- Requested length: ${targetLength} words\n`;
  user += `- Action type: CONTINUE\n\n`;

  user += `Continue naturally from where the TEXT left off.`;

  if (instruction) {
    user += `\n\nAdditional instruction: ${instruction}`;
  }

  return { system, user };
}

// ─── Node ───────────────────────────────────────────────────

function estimateTargetLength(text: string): number {
  const existingWords = countWords(text);
  if (existingWords < 50) return 50;
  if (existingWords < 200) return 100;
  return 200;
}

export async function writerNode(
  state: WriterStateValue,
): Promise<Partial<WriterStateValue>> {
  const { rawInput, userInstruction } = state;

  const targetLength = estimateTargetLength(rawInput);

  const styleProfile: StyleProfile = rawInput
    ? await analyzeStyle(rawInput, targetLength)
    : {
        tense: '',
        pointOfView: '',
        tone: '',
        formality: '',
        genre: '',
        notablePatterns: [],
      };

  const prompt = buildWriterPrompt(
    rawInput,
    styleProfile,
    targetLength,
    userInstruction,
  );

  const model = createWriterModel();
  const response = await model.invoke([
    { role: 'system', content: prompt.system },
    { role: 'user', content: prompt.user },
  ]);

  const generatedText =
    typeof response.content === 'string' ? response.content.trim() : '';

  return {
    styleProfile,
    targetLength,
    assembledPrompt: prompt,
    generatedText,
    finalDocument: rawInput + generatedText,
  };
}
