# Content Writer Agent Examples

LangGraph pipeline that routes by `--type` to a specific writer node. Defaults to `continue_writing` when no type is specified.

## Continue Writing

```bash
npx tsx playground/content_writer_agent/index.ts --input "The Roman Empire fell in 476 AD."
npx tsx playground/content_writer_agent/index.ts -i "The tele" -t continue_writing
npx tsx playground/content_writer_agent/index.ts -i "Coffee originated in Ethiopia."
npx tsx playground/content_writer_agent/index.ts -i "She opened the door and"
npx tsx playground/content_writer_agent/index.ts -i "Il caffè era ancora caldo sul tavolo."
```

## Suggestion Next

```bash
npx tsx playground/content_writer_agent/index.ts -i "The Roman Empire fell in 476 AD." -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "Quantum computing is still in its early stages." -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "La differenza tra un buon programmatore e uno eccellente sta nella" -t suggestion_next
```
