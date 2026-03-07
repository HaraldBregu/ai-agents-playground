# Writer Graph Examples

Tests the LangGraph writing graph (`src/graph.ts`) with a single writer node.

## System files

- `writing-assistant.md`
- `copywriter.md`
- `editor.md`
- `storyteller.md`

## Assistant files

- `expand.md`
- `continue.md`
- `rewrite-professional.md`
- `summarize.md`
- `simplify.md`
- `fix-grammar.md`
- `make-concise.md`
- `add-detail.md`

## Using assistant files

```bash
npx tsx playground/writer/index.ts --input "Coffee originated in Ethiopia." --file expand
npx tsx playground/writer/index.ts --input "The ship had been drifting for three days." --file continue
npx tsx playground/writer/index.ts --input "The meeting went okay I guess." --file rewrite-professional
npx tsx playground/writer/index.ts --input "AI is very complecated." --file fix-grammar
npx tsx playground/writer/index.ts --input "This is a long and somewhat redundant sentence that could be shorter." --file make-concise
npx tsx playground/writer/index.ts --input "The city was old." --file add-detail
```

## With system file

```bash
npx tsx playground/writer/index.ts --input "We sell shoes." --file expand --system-file copywriter
npx tsx playground/writer/index.ts --input "The door creaked open." --file continue --system-file storyteller
npx tsx playground/writer/index.ts --input "The meeting went okay I guess." --file rewrite-professional --system-file editor
```

## Inline instruction

```bash
npx tsx playground/writer/index.ts --input "Coffee originated in Ethiopia." --instruction "expand this into a full paragraph"
```

## Custom thread ID

```bash
npx tsx playground/writer/index.ts --input "The sun was setting." --file continue --thread story-1
```
