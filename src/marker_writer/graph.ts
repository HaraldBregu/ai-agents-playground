import { StateGraph, START, END } from '@langchain/langgraph';
import { MemorySaver } from '@langchain/langgraph';
import { WriterState, WriterStateValue } from '@/marker_writer/state';
import { inputParserNode } from '@/marker_writer/nodes/input-parser';
import { fastContextBuilderNode } from '@/marker_writer/nodes/fast-context-builder';
import { intentAnalyzerNode } from '@/marker_writer/nodes/intent-analyzer';
import { styleAnalyzerNode } from '@/marker_writer/nodes/style-analyzer';
import { plannerNode } from '@/marker_writer/nodes/planner';
import { writerNode } from '@/marker_writer/nodes/writer';
import { evaluatorNode } from '@/marker_writer/nodes/evaluator';
import { stitcherNode } from '@/marker_writer/nodes/stitcher';

//  ┌─────────────────────────────────────────────────────────────────┐
//  │                                                                 │
//  │  START → input_parser → routeAfterParse                         │
//  │                          ├─ [fast] → fast_context_builder ─┐    │
//  │                          └─ [full] → intent_analyzer       │    │
//  │                                         │                  │    │
//  │                                    style_analyzer          │    │
//  │                                         │                  │    │
//  │                                      planner               │    │
//  │                                         │                  │    │
//  │                                         └──────────────────┘    │
//  │                                                  │              │
//  │                                               writer            │
//  │                                                  │              │
//  │                                          routeEvaluator         │
//  │                                         ┌────┤      │           │
//  │                                         │[skip] [check]         │
//  │                                         │        │              │
//  │                                         │    evaluator          │
//  │                                         │        │              │
//  │                                         │  routeAfterEval       │
//  │                                         │  ┌─[pass] [retry]─┐   │
//  │                                         ▼  ▼                ▼   │
//  │                                      stitcher           writer  │
//  │                                         │                       │
//  │                                        END                      │
//  │                                                                 │
//  └─────────────────────────────────────────────────────────────────┘

const EVALUABLE_OPS = new Set([
  'CONTINUE',
  'BRIDGE',
  'PREPEND',
  'FILL_SECTION',
]);

function routeAfterParse(state: WriterStateValue): string {
  const p = state.parsedInput;
  if (
    p.operationType === 'CONTINUE' &&
    p.documentWordCount >= 50 &&
    !state.userInstruction
  ) {
    return 'fast';
  }
  return 'full';
}

function routeEvaluator(state: WriterStateValue): string {
  if (EVALUABLE_OPS.has(state.parsedInput.operationType)) {
    return 'check';
  }
  return 'skip';
}

function routeAfterEval(state: WriterStateValue): string {
  if (!state.evaluatorFeedback) {
    return 'pass';
  }
  if ((state.retryCount ?? 0) >= 2) {
    return 'pass';
  }
  return 'retry';
}

export function createMarkerWriterGraph() {
  const memory = new MemorySaver();

  const graph = new StateGraph(WriterState)
    .addNode('input_parser', inputParserNode)
    .addNode('fast_context_builder', fastContextBuilderNode)
    .addNode('intent_analyzer', intentAnalyzerNode)
    .addNode('style_analyzer', styleAnalyzerNode)
    .addNode('planner', plannerNode)
    .addNode('writer', writerNode)
    .addNode('evaluator', evaluatorNode)
    .addNode('stitcher', stitcherNode)

    // Entry
    .addEdge(START, 'input_parser')

    // Route after parsing: fast or full path
    .addConditionalEdges('input_parser', routeAfterParse, {
      fast: 'fast_context_builder',
      full: 'intent_analyzer',
    })

    // Fast path → writer
    .addEdge('fast_context_builder', 'writer')

    // Full path: sequential analysis pipeline
    .addEdge('intent_analyzer', 'style_analyzer')
    .addEdge('style_analyzer', 'planner')
    .addEdge('planner', 'writer')

    // After writer: check if we should evaluate
    .addConditionalEdges('writer', routeEvaluator, {
      check: 'evaluator',
      skip: 'stitcher',
    })

    // After evaluator: pass or retry
    .addConditionalEdges('evaluator', routeAfterEval, {
      pass: 'stitcher',
      retry: 'writer',
    })

    .addEdge('stitcher', END);

  return graph.compile({ checkpointer: memory });
}
