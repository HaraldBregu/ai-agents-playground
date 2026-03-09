

# Content Writer Agent Examples

LangGraph pipeline with a single writer node that continues and expands text content.

```
START → writer → END
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


EXAMPLE TEXT

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. (ACTIONS: continue writing)

ACTIONS: continue writing new paragraph, create new section

INTENTS: 

1- Continue writing 10 more words maximum.
2- Continue writing more content