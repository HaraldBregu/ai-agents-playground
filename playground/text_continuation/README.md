# Text Continuation Examples

LangGraph pipeline with a single writer node that generates a 200-400 word continuation of the input text.

```
START → writer → END
```

## Short input

```bash
npx tsx playground/text_continuation/index.ts --input "The ship had been drifting for three days."
npx tsx playground/text_continuation/index.ts --input "Coffee originated in Ethiopia."
npx tsx playground/text_continuation/index.ts --input "The old library smelled of dust and forgotten stories."
```

## Long input

```bash
npx tsx playground/text_continuation/index.ts --input "The industrial revolution fundamentally transformed the relationship between humans and machines. What began in the textile mills of 18th-century England soon spread across Europe and North America, reshaping economies, cities, and daily life. Factories replaced workshops, steam power replaced muscle, and a new class of urban workers emerged."

npx tsx playground/text_continuation/index.ts --input "She had always believed that travel was the best form of education. After graduating, she sold most of her belongings, packed a single backpack, and boarded a one-way flight to Bangkok. The first few weeks were overwhelming — the noise, the heat, the unfamiliar alphabet on every sign. But slowly, the city began to make sense."

npx tsx playground/text_continuation/index.ts --input "The human brain contains roughly 86 billion neurons, each forming thousands of connections with other neurons. This vast network gives rise to everything we experience — thought, memory, emotion, consciousness itself. Despite decades of research, neuroscience has only scratched the surface of understanding how these electrochemical signals produce the rich inner world we all inhabit."

npx tsx playground/text_continuation/index.ts --input "By the time the rescue team arrived, the village had been cut off for nearly a week. The river had swollen beyond its banks, swallowing roads and bridges alike. Families huddled in the school gymnasium, sharing blankets and whatever food remained. Outside, the rain showed no sign of stopping, and the forecast promised three more days of the same."
```
