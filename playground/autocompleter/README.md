# Autocompleter Examples

Completes incomplete text from where it ends, simulating an autocomplete engine.

## Basic completion

```bash
npx tsx playground/autocompleter/index.ts --input "The quick brown fox"
npx tsx playground/autocompleter/index.ts --input "Once upon a time, in a land"
```

## Stream response

```bash
npx tsx playground/autocompleter/index.ts --stream --input "The ship had been drifting for"
```

## Limit output tokens

```bash
npx tsx playground/autocompleter/index.ts --input "Coffee originated in" --max-tokens 30
```

## Low temperature (predictable)

```bash
npx tsx playground/autocompleter/index.ts --input "The capital of France is" --temperature 0
```

## High temperature (creative)

```bash
npx tsx playground/autocompleter/index.ts --input "She opened the door and" --temperature 1
```
