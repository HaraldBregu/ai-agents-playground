# Content Writer Agent Examples

LangGraph pipeline that routes by `--type` to a specific writer node. Defaults to `continue_writing` when no type is specified.

## Continue Writing

```bash
npx tsx playground/content_writer_agent/index.ts --input "The Roman Empire fell in 476 AD."
npx tsx playground/content_writer_agent/index.ts -i "The tele" -t continue_writing
npx tsx playground/content_writer_agent/index.ts -i "Coffee originated in Ethiopia."
npx tsx playground/content_writer_agent/index.ts -i "She opened the door and"
npx tsx playground/content_writer_agent/index.ts -i "Il caffè era ancora caldo sul tavolo."
npx tsx playground/content_writer_agent/index.ts -i "For centuries, the deep ocean remained one of the last unexplored frontiers on Earth. Early sailors feared what lurked beneath the waves, imagining sea monsters and bottomless trenches."
npx tsx playground/content_writer_agent/index.ts -i "The first computers filled entire rooms and consumed enormous amounts of electricity. They were operated by teams of engineers who fed instructions through punch cards."
npx tsx playground/content_writer_agent/index.ts -i "Leonardo da Vinci was not only a painter but also an inventor, scientist, and engineer. His notebooks reveal a mind centuries ahead of its time."
npx tsx playground/content_writer_agent/index.ts -i "The reason most startups fail is not because they lack funding, but because"
npx tsx playground/content_writer_agent/index.ts -i "In 1969, humans landed on the Moon for the first time. What followed was a wave of technological innovation that would reshape everyday life in ways no one could have predicted."
```

## Suggestion Next

```bash
npx tsx playground/content_writer_agent/index.ts -i "The Roman Empire fell in 476 AD." -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "Quantum computing is still in its early stages." -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "She opened the door and" -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "The smell of fresh bread reminded him of" -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "Artificial intelligence will transform the way we" -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "La differenza tra un buon programmatore e uno eccellente sta nella" -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "Il treno era in ritardo e la stazione era quasi deserta." -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "Die Geschichte der Berliner Mauer begann im August 1961." -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "La révolution française a profondément changé la société européenne." -t suggestion_next
npx tsx playground/content_writer_agent/index.ts -i "El descubrimiento de América en 1492 transformó el comercio mundial." -t suggestion_next
```
