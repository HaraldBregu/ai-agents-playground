# Instruction-based LLM Examples

LLM call with input text and an instruction to transform or extend it.

## Expand text

```bash
npx tsx playground/instructions/index.ts --input "Coffee originated in Ethiopia." --instruction "expand this into a full paragraph"
```

## Rewrite tone

```bash
npx tsx playground/instructions/index.ts --input "The meeting went okay I guess." --instruction "rewrite in a professional tone"
```

## Summarize

```bash
npx tsx playground/instructions/index.ts --input "The ship had been drifting for three days. Supplies were low, and the crew had stopped speaking to one another. On the fourth morning, a light appeared on the horizon." --instruction "summarize in one sentence"
```

## Continue writing

```bash
npx tsx playground/instructions/index.ts --input "The ship had been drifting for three days. Supplies were low, and the crew had stopped speaking to one another." --instruction "continue the story"
```

## Stream response

```bash
npx tsx playground/instructions/index.ts --stream --input "Coffee originated in Ethiopia." --instruction "expand this into a full paragraph"
```

## Limit output tokens

```bash
npx tsx playground/instructions/index.ts --input "Coffee originated in Ethiopia." --instruction "expand this into a full paragraph" --max-tokens 100
```
