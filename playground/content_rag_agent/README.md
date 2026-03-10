# Content RAG Agent

A Retrieval-Augmented Generation agent built with LangGraph that answers questions using a local knowledge base.

## How It Works

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│  START   │────▶│ retrieve  │────▶│ generate  │────▶ END
└─────────┘     └──────────┘     └──────────┘
```

1. **Retrieve** — Chunks the knowledge base by section, embeds the query and chunks using OpenAI embeddings, and returns the top-3 most relevant chunks via cosine similarity.
2. **Generate** — Feeds the retrieved context and the original question to GPT-4o to produce a grounded answer.

## Usage

```bash
yarn tsx playground/content_rag_agent/index.ts --question "What year was the first liquid-fueled rocket launched?"
```

## Knowledge Base

Edit `knowledge_base.md` to change the content the agent retrieves from. The file is automatically chunked by `##` sections at retrieval time.
