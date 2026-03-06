import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInvoke = vi.fn();

vi.mock('@langchain/openai', () => ({
  ChatOpenAI: vi.fn(function (this: any, opts: Record<string, unknown>) {
    this._opts = opts;
    this.invoke = mockInvoke;
  }),
}));

import { evaluatorNode } from '@/marker_writer/nodes/evaluator';
import type { WriterStateValue } from '@/marker_writer/state';
import type { ParsedInput } from '@/marker_writer/types';
import { ChatOpenAI } from '@langchain/openai';

function makeParsed(overrides: Partial<ParsedInput> = {}): ParsedInput {
  return {
    markerType: 'CONTINUE',
    markerPosition: 'END_OF_TEXT',
    operationType: 'CONTINUE',
    textBefore: 'Some existing text.',
    textAfter: '',
    selectedRegion: '',
    immediateBefore: 'Some existing text.',
    immediateAfter: '',
    lastSentenceBefore: 'Some existing text.',
    firstSentenceAfter: '',
    isInsideParagraph: false,
    isInsideSentence: false,
    isAfterHeading: false,
    isBeforeHeading: false,
    currentHeading: '',
    previousHeading: '',
    nextHeading: '',
    totalCharsBefore: 19,
    totalCharsAfter: 0,
    documentWordCount: 3,
    markerCharIndex: 19,
    markerLineNumber: 1,
    markerColumnNumber: 20,
    ...overrides,
  };
}

function makeState(
  parsedOverrides: Partial<ParsedInput> = {},
): WriterStateValue {
  return {
    parsedInput: makeParsed(parsedOverrides),
    generatedText: 'Generated continuation text.',
    styleProfile: {
      tone: 'conversational',
      avgSentenceLength: 15,
      paragraphStyle: 'short punchy',
      vocabulary: 'simple',
      pointOfView: 'third person',
      tense: 'present',
      notablePatterns: [],
    },
    retryCount: 0,
  } as unknown as WriterStateValue;
}

describe('evaluatorNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty feedback and unchanged retryCount on pass', async () => {
    mockInvoke.mockResolvedValue({
      content: JSON.stringify({
        pass: true,
        issues: [],
        retryInstruction: '',
      }),
    });
    const result = await evaluatorNode(makeState());
    expect(result.evaluatorFeedback).toBe('');
    expect(result.retryCount).toBe(0);
  });

  it('returns feedback and increments retryCount on failure', async () => {
    mockInvoke.mockResolvedValue({
      content: JSON.stringify({
        pass: false,
        issues: ['Voice mismatch'],
        retryInstruction: 'Use a more formal tone.',
      }),
    });
    const result = await evaluatorNode(makeState());
    expect(result.evaluatorFeedback).toBe('Use a more formal tone.');
    expect(result.retryCount).toBe(1);
  });

  it('calls the reviewer model', async () => {
    mockInvoke.mockResolvedValue({
      content: JSON.stringify({ pass: true, issues: [], retryInstruction: '' }),
    });
    await evaluatorNode(makeState());
    expect(ChatOpenAI).toHaveBeenCalled();
    const callArgs = (ChatOpenAI as any).mock.calls[0][0];
    expect(callArgs.temperature).toBeLessThanOrEqual(0.1);
  });

  it('includes after-check for BRIDGE operations', async () => {
    mockInvoke.mockResolvedValue({
      content: JSON.stringify({ pass: true, issues: [], retryInstruction: '' }),
    });
    await evaluatorNode(
      makeState({
        operationType: 'BRIDGE',
        firstSentenceAfter: 'The next section starts here.',
      }),
    );
    const systemPrompt = mockInvoke.mock.calls[0][0][0].content;
    expect(systemPrompt).toContain('SEAM COHERENCE (after)');
    expect(systemPrompt).not.toContain('N/A');
  });

  it('skips after-check for CONTINUE operations', async () => {
    mockInvoke.mockResolvedValue({
      content: JSON.stringify({ pass: true, issues: [], retryInstruction: '' }),
    });
    await evaluatorNode(makeState({ operationType: 'CONTINUE' }));
    const systemPrompt = mockInvoke.mock.calls[0][0][0].content;
    expect(systemPrompt).toContain('N/A');
  });

  it('falls back to issues join when retryInstruction is empty', async () => {
    mockInvoke.mockResolvedValue({
      content: JSON.stringify({
        pass: false,
        issues: ['Repeated phrases', 'Wrong tense'],
        retryInstruction: '',
      }),
    });
    const result = await evaluatorNode(makeState());
    expect(result.evaluatorFeedback).toBe('Repeated phrases; Wrong tense');
  });

  it('strips markdown code fences from response', async () => {
    mockInvoke.mockResolvedValue({
      content:
        '```json\n' +
        JSON.stringify({ pass: true, issues: [], retryInstruction: '' }) +
        '\n```',
    });
    const result = await evaluatorNode(makeState());
    expect(result.evaluatorFeedback).toBe('');
  });
});
