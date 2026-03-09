# AI Agents Playground

A collection of AI agent experiments built with LangChain, LangGraph, and OpenAI. Each playground explores a different pattern for working with LLMs — from single calls to graph-based pipelines.

## Playgrounds

### Basic

Single LLM call with configurable model, temperature, streaming, and token limits.

```bash
npx tsx playground/basic/index.ts --prompt "Write one sentence about the ocean."
npx tsx playground/basic/index.ts --stream --prompt "Write a short paragraph about the moon."
```

### Instructions

LLM call with input text, a system role, and an assistant instruction loaded from markdown files.

```bash
npx tsx playground/instructions/index.ts --input "Coffee originated in Ethiopia." --file expand
npx tsx playground/instructions/index.ts --system-file copywriter --input "We sell shoes." --file expand
```

### Writer

LangGraph writing graph with a single writer node, system/assistant prompt files, and thread support.

```bash
npx tsx playground/writer/index.ts --input "Coffee originated in Ethiopia." --file expand
npx tsx playground/writer/index.ts --input "The door creaked open." --file continue --system-file storyteller
```

### Autocompleter

Completes incomplete sentences or continues finished text with new sentences.

```bash
npx tsx playground/autocompleter/index.ts --input "The quick brown fox"
npx tsx playground/autocompleter/index.ts --stream --input "It was a cold winter morning."
```

## Setup

```bash
yarn install
cp .env.example .env
# Add your OpenAI API key to .env
```

## Project Structure

```
playground/
├── basic/              # Single LLM call
├── instructions/       # System + assistant prompt files
│   ├── system/         # System role prompts
│   └── assistant/      # Task instruction prompts
├── writer/             # LangGraph writing graph
│   ├── system/         # System role prompts
│   └── assistant/      # Task instruction prompts
├── autocompleter/      # Sentence completion
└── save-result.ts      # Shared result saving utility
```

## Dependencies

- `@langchain/openai` — OpenAI LLM integration
- `@langchain/langgraph` — Graph-based agent orchestration
- `@langchain/core` — Core LangChain types and utilities
- `zod` — Type-safe schema validation

## Requirements

- Node.js 18+
- OpenAI API key

## License

MIT
