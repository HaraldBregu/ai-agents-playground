# Sentence Completer Examples

LangGraph pipeline with a single completer node that finishes incomplete words and sentences.

```
START → completer → END
```

## Finished sentences

```bash
npx tsx playground/sentence_completer/index.ts --input "The ship had been drifting for three days."
npx tsx playground/sentence_completer/index.ts --input "Coffee originated in Ethiopia."
npx tsx playground/sentence_completer/index.ts --input "The old library smelled of dust and forgotten stories."
npx tsx playground/sentence_completer/index.ts --input "She finally understood what he had been trying to say all along."
```

## Incomplete words

```bash
npx tsx playground/sentence_completer/index.ts --input "The tele"
npx tsx playground/sentence_completer/index.ts --input "She was incredi"
npx tsx playground/sentence_completer/index.ts --input "The govern"
npx tsx playground/sentence_completer/index.ts --input "It was an unforg"
npx tsx playground/sentence_completer/index.ts --input "The astro"
npx tsx playground/sentence_completer/index.ts --input "They walked through the neigh"
npx tsx playground/sentence_completer/index.ts --input "He opened his laptop and started typ"
npx tsx playground/sentence_completer/index.ts --input "The experiment produced unexpe"
```

## Unfinished sentences

```bash
npx tsx playground/sentence_completer/index.ts --input "The reason most startups fail is not because they lack funding, but because"
npx tsx playground/sentence_completer/index.ts --input "She opened the envelope carefully, and inside she found"
npx tsx playground/sentence_completer/index.ts --input "After months of searching, the archaeologists finally uncovered what appeared to be"
npx tsx playground/sentence_completer/index.ts --input "The difference between a good engineer and a great one comes down to"
```

## Long input with unfinished sentence

```bash
npx tsx playground/sentence_completer/index.ts --input "For centuries, the deep ocean remained one of the last unexplored frontiers on Earth. Early sailors feared what lurked beneath the waves, imagining sea monsters and bottomless trenches. It wasn't until the invention of modern submersibles that scientists could finally descend to the ocean floor, where they discovered"

npx tsx playground/sentence_completer/index.ts --input "Machine learning models have become remarkably good at pattern recognition. They can identify faces in photos, translate languages in real time, and even generate realistic images from text descriptions. Yet despite these advances, there remains a fundamental gap between what these systems can do and what we would consider true understanding, because"
```

## Italian - Incomplete words

```bash
npx tsx playground/sentence_completer/index.ts --input "Il tele"
npx tsx playground/sentence_completer/index.ts --input "Era incredi"
npx tsx playground/sentence_completer/index.ts --input "Il gover"
npx tsx playground/sentence_completer/index.ts --input "Camminavano attraverso il quar"
npx tsx playground/sentence_completer/index.ts --input "L'esperimento produsse risul"
```

## Italian - Unfinished sentences

```bash
npx tsx playground/sentence_completer/index.ts --input "Il motivo per cui molte aziende falliscono non è la mancanza di fondi, ma perché"
npx tsx playground/sentence_completer/index.ts --input "Aprì la lettera con mani tremanti e dentro trovò"
npx tsx playground/sentence_completer/index.ts --input "Dopo anni di ricerche, gli scienziati finalmente scoprirono che"
npx tsx playground/sentence_completer/index.ts --input "La differenza tra un buon programmatore e uno eccellente sta nella"
```
