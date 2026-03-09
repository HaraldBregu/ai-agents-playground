# Content Writer Agent Examples

LangGraph pipeline with an intent resolver and a writer node. The intent node analyzes what the user wants, then the writer executes it.

```
START → intent → writer → END
```

## Finished sentences

```bash
npx tsx playground/content_writer_agent/index.ts --input "The ship had been drifting for three days."
npx tsx playground/content_writer_agent/index.ts --input "Coffee originated in Ethiopia."
npx tsx playground/content_writer_agent/index.ts --input "The old library smelled of dust and forgotten stories."
npx tsx playground/content_writer_agent/index.ts --input "She finally understood what he had been trying to say all along."
```

## Incomplete words

```bash
npx tsx playground/content_writer_agent/index.ts --input "The tele"
npx tsx playground/content_writer_agent/index.ts --input "She was incredi"
npx tsx playground/content_writer_agent/index.ts --input "The govern"
npx tsx playground/content_writer_agent/index.ts --input "It was an unforg"
npx tsx playground/content_writer_agent/index.ts --input "The astro"
npx tsx playground/content_writer_agent/index.ts --input "They walked through the neigh"
npx tsx playground/content_writer_agent/index.ts --input "He opened his laptop and started typ"
npx tsx playground/content_writer_agent/index.ts --input "The experiment produced unexpe"
```

## Unfinished sentences

```bash
npx tsx playground/content_writer_agent/index.ts --input "The reason most startups fail is not because they lack funding, but because"
npx tsx playground/content_writer_agent/index.ts --input "She opened the envelope carefully, and inside she found"
npx tsx playground/content_writer_agent/index.ts --input "After months of searching, the archaeologists finally uncovered what appeared to be"
npx tsx playground/content_writer_agent/index.ts --input "The difference between a good engineer and a great one comes down to"
```

## Long input with unfinished sentence

```bash
npx tsx playground/content_writer_agent/index.ts --input "For centuries, the deep ocean remained one of the last unexplored frontiers on Earth. Early sailors feared what lurked beneath the waves, imagining sea monsters and bottomless trenches. It wasn't until the invention of modern submersibles that scientists could finally descend to the ocean floor, where they discovered"

npx tsx playground/content_writer_agent/index.ts --input "Machine learning models have become remarkably good at pattern recognition. They can identify faces in photos, translate languages in real time, and even generate realistic images from text descriptions. Yet despite these advances, there remains a fundamental gap between what these systems can do and what we would consider true understanding, because"
```

## Streaming

```bash
npx tsx playground/content_writer_agent/index.ts --stream --input "The difference between a good engineer and a great one comes down to"
npx tsx playground/content_writer_agent/index.ts --stream --input "Machine learning models have become remarkably good at pattern recognition."
```

## Italian - Finished sentences

```bash
npx tsx playground/content_writer_agent/index.ts --input "Il sole tramontava dietro le colline."
npx tsx playground/content_writer_agent/index.ts --input "Il caffè era ancora caldo sul tavolo."
npx tsx playground/content_writer_agent/index.ts --input "La vecchia libreria profumava di carta e ricordi."
npx tsx playground/content_writer_agent/index.ts --input "Non aveva mai visto un tramonto così bello."
```

## Italian - Incomplete words

```bash
npx tsx playground/content_writer_agent/index.ts --input "Il tele"
npx tsx playground/content_writer_agent/index.ts --input "Era incredi"
npx tsx playground/content_writer_agent/index.ts --input "Il gover"
npx tsx playground/content_writer_agent/index.ts --input "Camminavano attraverso il quar"
npx tsx playground/content_writer_agent/index.ts --input "L'esperimento produsse risul"
```

## Italian - Unfinished sentences

```bash
npx tsx playground/content_writer_agent/index.ts --input "Il motivo per cui molte aziende falliscono non è la mancanza di fondi, ma perché"
npx tsx playground/content_writer_agent/index.ts --input "Aprì la lettera con mani tremanti e dentro trovò"
npx tsx playground/content_writer_agent/index.ts --input "Dopo anni di ricerche, gli scienziati finalmente scoprirono che"
npx tsx playground/content_writer_agent/index.ts --input "La differenza tra un buon programmatore e uno eccellente sta nella"
```

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