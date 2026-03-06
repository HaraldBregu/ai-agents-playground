import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInvoke = vi.fn();

vi.mock('@langchain/openai', () => ({
  ChatOpenAI: vi.fn(function (this: any, opts: Record<string, unknown>) {
    this._opts = opts;
    this.invoke = mockInvoke;
  }),
}));

import { intentAnalyzerNode } from '@/marker_writer/nodes/intent-analyzer';
import type { WriterStateValue } from '@/marker_writer/state';
import type { ParsedInput } from '@/marker_writer/types';
import { ChatOpenAI } from '@langchain/openai';

function makeParsed(overrides: Partial<ParsedInput> = {}): ParsedInput {
  return {
    markerType: 'CONTINUE',
    markerPosition: 'END_OF_TEXT',
    operationType: 'CONTINUE',
    textBefore: '',
    textAfter: '',
    selectedRegion: '',
    immediateBefore: '',
    immediateAfter: '',
    lastSentenceBefore: '',
    firstSentenceAfter: '',
    isInsideParagraph: false,
    isInsideSentence: false,
    isAfterHeading: false,
    isBeforeHeading: false,
    currentHeading: '',
    previousHeading: '',
    nextHeading: '',
    totalCharsBefore: 0,
    totalCharsAfter: 0,
    documentWordCount: 0,
    markerCharIndex: 0,
    markerLineNumber: 1,
    markerColumnNumber: 1,
    ...overrides,
  };
}

function makeState(
  parsedOverrides: Partial<ParsedInput> = {},
  userInstruction = '',
): WriterStateValue {
  return {
    parsedInput: makeParsed(parsedOverrides),
    userInstruction,
  } as unknown as WriterStateValue;
}

const defaultIntentResponse = {
  contentType: 'BLOG_POST',
  writingIntent: 'inform',
  topic: 'coffee history',
  audience: 'general readers',
  desiredTone: 'conversational',
  desiredLength: '~200 words',
  keyMessage: 'coffee has a rich history',
  constraints: [],
};

describe('intentAnalyzerNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInvoke.mockResolvedValue({
      content: JSON.stringify(defaultIntentResponse),
    });
  });

  it('always calls the LLM', async () => {
    const state = makeState(
      {
        operationType: 'CONTINUE',
        documentWordCount: 200,
        textBefore: 'word '.repeat(200),
      },
      '',
    );
    await intentAnalyzerNode(state);
    expect(ChatOpenAI).toHaveBeenCalled();
  });

  it('calls the LLM when a userInstruction is provided', async () => {
    const state = makeState(
      {
        operationType: 'CONTINUE',
        documentWordCount: 200,
        textBefore: 'word '.repeat(200),
      },
      'write something funny',
    );
    await intentAnalyzerNode(state);
    expect(ChatOpenAI).toHaveBeenCalled();
  });

  it('calls the LLM when operationType is not CONTINUE', async () => {
    const state = makeState(
      {
        operationType: 'GENERATE',
        documentWordCount: 200,
        textBefore: 'word '.repeat(200),
      },
      '',
    );
    await intentAnalyzerNode(state);
    expect(ChatOpenAI).toHaveBeenCalled();
  });

  it('returns parsed intentAnalysis from LLM JSON response', async () => {
    const state = makeState(
      {
        operationType: 'GENERATE',
        documentWordCount: 0,
      },
      'write about coffee',
    );
    const result = await intentAnalyzerNode(state);
    expect(result.intentAnalysis).toBeDefined();
    expect(result.intentAnalysis!.contentType).toBe('BLOG_POST');
    expect(result.intentAnalysis!.topic).toBe('coffee history');
  });

  it('strips markdown code fences from LLM response', async () => {
    mockInvoke.mockResolvedValue({
      content: '```json\n' + JSON.stringify(defaultIntentResponse) + '\n```',
    });
    const state = makeState({ operationType: 'GENERATE' }, 'write about AI');
    const result = await intentAnalyzerNode(state);
    expect(result.intentAnalysis!.contentType).toBe('BLOG_POST');
  });
});
