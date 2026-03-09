# Text Continuation Examples

LangGraph write-evaluate-rewrite loop that generates text continuations and iteratively improves them until a quality threshold is met.

## How it works

```
START → writer → evaluator → router
                                ├─ passed (score >= 7) → END
                                ├─ iterations < max → writer (retry)
                                └─ iterations >= max → END
```

The writer generates a 200-400 word continuation. The evaluator scores it (0-10) on coherence, style consistency, quality, and flow. If the score is below 7, the writer retries with the evaluator's feedback.

## Usage

```bash
npx tsx playground/text_continuation/index.ts --input "The ship had been drifting for three days."
npx tsx playground/text_continuation/index.ts --input "Coffee originated in Ethiopia."
```

## With verbose output

```bash
npx tsx playground/text_continuation/index.ts --verbose --input "The old library smelled of dust and forgotten stories."
```

## Custom max iterations

```bash
npx tsx playground/text_continuation/index.ts --input "The city never sleeps." --max-iterations 5
npx tsx playground/text_continuation/index.ts --input "Rain began to fall." --max-iterations 1
```
