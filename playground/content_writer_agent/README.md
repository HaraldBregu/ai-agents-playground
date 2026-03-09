# Content Writer Agent Examples

LangGraph pipeline that routes by `--type` to a specific writer node. Defaults to `continue_writing` when no type is specified.

## Continue Writing

Default length is `short` (10–15 words). Use `--length` / `-l` to control output length: `short`, `medium`, or `long`.

```bash
# short (default, 10–15 words)
npx tsx playground/content_writer_agent/index.ts -i "The Roman Empire fell in 476 AD."
npx tsx playground/content_writer_agent/index.ts -i "The tele"
npx tsx playground/content_writer_agent/index.ts -i "She opened the door and"
npx tsx playground/content_writer_agent/index.ts -i "Il caffè era ancora caldo sul tavolo."
npx tsx playground/content_writer_agent/index.ts -i "Coffee originated in Ethiopia."
npx tsx playground/content_writer_agent/index.ts -i "The reason most startups fail is not because they lack funding, but because"

# medium (25–30 words)
npx tsx playground/content_writer_agent/index.ts -i "The Roman Empire fell in 476 AD." -l medium
npx tsx playground/content_writer_agent/index.ts -i "Leonardo da Vinci was not only a painter but also an inventor, scientist, and engineer." -l medium
npx tsx playground/content_writer_agent/index.ts -i "The first computers filled entire rooms and consumed enormous amounts of electricity." -l medium
npx tsx playground/content_writer_agent/index.ts -i "Il treno era in ritardo e la stazione era quasi deserta." -l medium

# long (50–60 words)
npx tsx playground/content_writer_agent/index.ts -i "The Roman Empire fell in 476 AD." -l long
npx tsx playground/content_writer_agent/index.ts -i "For centuries, the deep ocean remained one of the last unexplored frontiers on Earth." -l long
npx tsx playground/content_writer_agent/index.ts -i "In 1969, humans landed on the Moon for the first time." -l long
npx tsx playground/content_writer_agent/index.ts -i "Die Geschichte der Berliner Mauer begann im August 1961." -l long
npx tsx playground/content_writer_agent/index.ts -i "La révolution française a profondément changé la société européenne." -l long
```
