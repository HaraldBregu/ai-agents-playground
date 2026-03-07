import { StateGraph, MemorySaver } from '@langchain/langgraph';
import { WriterState } from '@/state';
import { writerNode } from '@/nodes/writer';

export function createWritingGraph() {
  const graph = new StateGraph(WriterState)
    .addNode('writer', writerNode)
    .addEdge('__start__', 'writer')
    .addEdge('writer', '__end__');

  return graph.compile({ checkpointer: new MemorySaver() });
}
