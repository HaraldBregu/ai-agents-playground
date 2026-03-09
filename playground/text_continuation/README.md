# Text Continuation Examples

LangGraph pipeline with a single writer node that generates a 200-400 word continuation of the input text.

```
START → writer → END
```

## Usage

```bash
npx tsx playground/text_continuation/index.ts --input "The ship had been drifting for three days."
npx tsx playground/text_continuation/index.ts --input "Coffee originated in Ethiopia."
npx tsx playground/text_continuation/index.ts --input "The old library smelled of dust and forgotten stories."
```
