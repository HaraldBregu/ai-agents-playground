import { describe, it, expect } from 'vitest';
import { fastContextBuilderNode } from '@/marker_writer/nodes/fast-context-builder';
import type { WriterStateValue } from '@/marker_writer/state';
import type { ParsedInput } from '@/marker_writer/types';

function makeParsed(overrides: Partial<ParsedInput> = {}): ParsedInput {
  return {
    markerType: 'CONTINUE',
    markerPosition: 'END_OF_TEXT',
    operationType: 'CONTINUE',
    textBefore: 'word '.repeat(100),
    textAfter: '',
    selectedRegion: '',
    immediateBefore: 'The quick brown fox jumped over the lazy dog.',
    immediateAfter: '',
    lastSentenceBefore: 'The quick brown fox jumped over the lazy dog.',
    firstSentenceAfter: '',
    isInsideParagraph: false,
    isInsideSentence: false,
    isAfterHeading: false,
    isBeforeHeading: false,
    currentHeading: '',
    previousHeading: '',
    nextHeading: '',
    totalCharsBefore: 500,
    totalCharsAfter: 0,
    documentWordCount: 100,
    markerCharIndex: 500,
    markerLineNumber: 1,
    markerColumnNumber: 501,
    ...overrides,
  };
}

function makeState(
  parsedOverrides: Partial<ParsedInput> = {},
): WriterStateValue {
  return {
    parsedInput: makeParsed(parsedOverrides),
    userInstruction: '',
  } as unknown as WriterStateValue;
}

describe('fastContextBuilderNode', () => {
  it('returns intentAnalysis, styleProfile, and writingPlan', async () => {
    const result = await fastContextBuilderNode(makeState());
    expect(result.intentAnalysis).toBeDefined();
    expect(result.styleProfile).toBeDefined();
    expect(result.writingPlan).toBeDefined();
  });

  it('sets writingIntent to CONTINUE', async () => {
    const result = await fastContextBuilderNode(makeState());
    expect(result.intentAnalysis!.writingIntent).toBe('CONTINUE');
  });

  it('uses currentHeading as topic when available', async () => {
    const result = await fastContextBuilderNode(
      makeState({ currentHeading: 'Coffee Origins' }),
    );
    expect(result.intentAnalysis!.topic).toBe('Coffee Origins');
  });

  it('falls back to generic topic when no heading', async () => {
    const result = await fastContextBuilderNode(
      makeState({ currentHeading: '' }),
    );
    expect(result.intentAnalysis!.topic).toBe('continuation of existing text');
  });

  it('includes sentence-completion constraint when isInsideSentence', async () => {
    const result = await fastContextBuilderNode(
      makeState({ isInsideSentence: true }),
    );
    expect(result.intentAnalysis!.constraints).toContain(
      'complete the current sentence first',
    );
  });

  it('omits sentence-completion constraint when not inside a sentence', async () => {
    const result = await fastContextBuilderNode(
      makeState({ isInsideSentence: false }),
    );
    expect(result.intentAnalysis!.constraints).not.toContain(
      'complete the current sentence first',
    );
  });

  it('computes avgSentenceLength from immediateBefore', async () => {
    const result = await fastContextBuilderNode(
      makeState({
        immediateBefore: 'First sentence here. Second sentence there.',
      }),
    );
    expect(result.styleProfile!.avgSentenceLength).toBeGreaterThan(0);
  });

  it('detects first person POV', async () => {
    const result = await fastContextBuilderNode(
      makeState({
        immediateBefore:
          'I went to the store. I bought some milk. My cart was full.',
      }),
    );
    expect(result.styleProfile!.pointOfView).toBe('first person');
  });

  it('detects third person POV', async () => {
    const result = await fastContextBuilderNode(
      makeState({
        immediateBefore:
          'He went to the store. She bought some milk. Their cart was full.',
      }),
    );
    expect(result.styleProfile!.pointOfView).toBe('third person');
  });

  it('detects past tense', async () => {
    const result = await fastContextBuilderNode(
      makeState({
        immediateBefore: 'He was there. They were happy. She had gone home.',
      }),
    );
    expect(result.styleProfile!.tense).toBe('past');
  });

  it('sets writingPlan approach to continue naturally', async () => {
    const result = await fastContextBuilderNode(makeState());
    expect(result.writingPlan!.approach).toBe(
      'Continue naturally from the final sentence',
    );
  });

  it('sets targetWords proportional to document length', async () => {
    const result = await fastContextBuilderNode(
      makeState({ documentWordCount: 1000 }),
    );
    expect(result.writingPlan!.targetWords).toBeLessThanOrEqual(300);
    expect(result.writingPlan!.targetWords).toBeGreaterThanOrEqual(100);
  });

  it('infers SOCIAL_POST for short text', async () => {
    const result = await fastContextBuilderNode(
      makeState({
        textBefore: 'word '.repeat(50),
        textAfter: 'word '.repeat(50),
        documentWordCount: 100,
      }),
    );
    expect(result.intentAnalysis!.contentType).toBe('SOCIAL_POST');
  });

  it('infers EMAIL when text starts with a greeting', async () => {
    const result = await fastContextBuilderNode(
      makeState({
        textBefore: 'Dear John,\nI am writing to you.',
        textAfter: 'word '.repeat(200),
        documentWordCount: 200,
      }),
    );
    expect(result.intentAnalysis!.contentType).toBe('EMAIL');
  });
});
