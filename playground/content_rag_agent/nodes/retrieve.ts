import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { OpenAIEmbeddings } from '@langchain/openai';
import type { RagState } from '../graph';

const TOP_K = 3;

function chunkBySection(text: string): string[] {
  const sections = text.split(/\n## /);
  const chunks: string[] = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const restored =
      sections.indexOf(section) === 0 ? trimmed : `## ${trimmed}`;
    if (restored.length > 1500) {
      const paragraphs = restored.split(/\n\n+/);
      let current = '';
      for (const paragraph of paragraphs) {
        if (current.length + paragraph.length > 1500 && current) {
          chunks.push(current.trim());
          current = paragraph;
        } else {
          current += (current ? '\n\n' : '') + paragraph;
        }
      }
      if (current.trim()) chunks.push(current.trim());
    } else {
      chunks.push(restored);
    }
  }

  return chunks;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveNode(
  state: typeof RagState.State,
): Promise<Partial<typeof RagState.State>> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const knowledgePath = join(currentDir, '..', 'knowledge_base.md');
  const content = readFileSync(knowledgePath, 'utf-8');

  const chunks = chunkBySection(content);
  console.log(`[retrieve] ${chunks.length} chunks from knowledge base`);

  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
  });

  const [queryEmbedding, ...chunkEmbeddings] = await embeddings.embedDocuments([
    state.question,
    ...chunks,
  ]);

  const scored = chunks.map((chunk, i) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunkEmbeddings[i]),
  }));

  scored.sort((a, b) => b.score - a.score);

  const topChunks = scored.slice(0, TOP_K).map((s) => s.chunk);

  for (const s of scored.slice(0, TOP_K)) {
    console.log(
      `[retrieve] score=${s.score.toFixed(3)} | ${s.chunk.slice(0, 80)}...`,
    );
  }

  return { context: topChunks };
}
