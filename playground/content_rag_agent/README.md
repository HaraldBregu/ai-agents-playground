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
# Early rocketry
yarn tsx playground/content_rag_agent/index.ts --question "What year was the first liquid-fueled rocket launched?"

# The Space Race
yarn tsx playground/content_rag_agent/index.ts --question "Who was the first human to orbit the Earth?"

# Moon landings
yarn tsx playground/content_rag_agent/index.ts --question "How many Apollo missions landed on the Moon?"

# Space stations
yarn tsx playground/content_rag_agent/index.ts --question "What is the International Space Station and which countries are involved?"

# Commercial spaceflight
yarn tsx playground/content_rag_agent/index.ts --question "What role does SpaceX play in the new space economy?"

# Mars exploration
yarn tsx playground/content_rag_agent/index.ts --question "What are the main challenges of sending humans to Mars?"

# Space law
yarn tsx playground/content_rag_agent/index.ts --question "What is the Outer Space Treaty?"
```

## Knowledge Base

Edit `knowledge_base.md` to change the content the agent retrieves from. The file is automatically chunked by `##` sections at retrieval time.
