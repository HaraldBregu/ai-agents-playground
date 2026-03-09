# Content Writer Agent Examples

LangGraph pipeline with an intent resolver and a writer node. The intent node analyzes what the user wants, then the writer executes it.


## Intent: Continue writing with constraints

```bash
npx tsx playground/content_writer_agent/index.ts --input "The history of coffee is fascinating. Continue writing 10 more words maximum."
npx tsx playground/content_writer_agent/index.ts --input "Artificial intelligence is transforming healthcare. Continue writing one short paragraph."
npx tsx playground/content_writer_agent/index.ts --input "The Roman Empire fell in 476 AD. Continue writing 3 sentences."
```

## Intent: Continue writing new paragraph

```bash
npx tsx playground/content_writer_agent/index.ts --input "The first computers filled entire rooms and consumed enormous amounts of electricity. They were operated by teams of engineers who fed instructions through punch cards. Start a new paragraph about modern computing."
npx tsx playground/content_writer_agent/index.ts --input "Leonardo da Vinci was not only a painter but also an inventor, scientist, and engineer. His notebooks reveal a mind centuries ahead of its time. Write a new paragraph about his inventions."
```

## Intent: Create new section

```bash
npx tsx playground/content_writer_agent/index.ts --input "React is a JavaScript library for building user interfaces. It uses a virtual DOM to efficiently update the real DOM. Create a new section about React hooks."
npx tsx playground/content_writer_agent/index.ts --input "Python is known for its simplicity and readability. It has become the go-to language for data science and machine learning. Create a new section about Python libraries."
```

## Intent: Summarize

```bash
npx tsx playground/content_writer_agent/index.ts --input "Summarize this: The Industrial Revolution, which began in Britain in the late 18th century, was a period of great change. It saw the transition from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools, and the rise of the mechanized factory system. The revolution also led to an unprecedented rise in population and urbanization."
npx tsx playground/content_writer_agent/index.ts --input "Summarize in 2 sentences: Machine learning models have become remarkably good at pattern recognition. They can identify faces in photos, translate languages in real time, and even generate realistic images from text descriptions. Yet despite these advances, there remains a fundamental gap between what these systems can do and what we would consider true understanding."
```

## Intent: Rewrite

```bash
npx tsx playground/content_writer_agent/index.ts --input "Rewrite this more professionally: So basically the thing is that our app is kinda slow and users are complaining a lot about it. We gotta fix it ASAP or we're gonna lose customers."
npx tsx playground/content_writer_agent/index.ts --input "Rewrite in a simpler way: The epistemological ramifications of quantum mechanical observations necessitate a fundamental reconceptualization of our ontological frameworks."
```

## Intent: Expand

```bash
npx tsx playground/content_writer_agent/index.ts --input "Expand this: TypeScript adds static typing to JavaScript."
npx tsx playground/content_writer_agent/index.ts --input "Expand with more detail: The Mediterranean diet is considered one of the healthiest in the world."
```
