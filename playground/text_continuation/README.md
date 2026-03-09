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

## Unfinished sentences

```bash
npx tsx playground/text_continuation/index.ts --input "The reason most startups fail is not because they lack funding, but because"

npx tsx playground/text_continuation/index.ts --input "She opened the envelope carefully, and inside she found"

npx tsx playground/text_continuation/index.ts --input "After months of searching, the archaeologists finally uncovered what appeared to be"

npx tsx playground/text_continuation/index.ts --input "The difference between a good engineer and a great one comes down to"
```

## Long input with unfinished sentence

```bash
npx tsx playground/text_continuation/index.ts --input "For centuries, the deep ocean remained one of the last unexplored frontiers on Earth. Early sailors feared what lurked beneath the waves, imagining sea monsters and bottomless trenches. It wasn't until the invention of modern submersibles that scientists could finally descend to the ocean floor, where they discovered"

npx tsx playground/text_continuation/index.ts --input "The city of Vienna had long been the cultural heart of Europe. Composers like Mozart, Beethoven, and Strauss had walked its cobblestone streets. Its coffee houses had hosted philosophers, poets, and revolutionaries alike. But by the early 20th century, a new generation of thinkers was emerging — one that would challenge everything the old world had"

npx tsx playground/text_continuation/index.ts --input "Machine learning models have become remarkably good at pattern recognition. They can identify faces in photos, translate languages in real time, and even generate realistic images from text descriptions. Yet despite these advances, there remains a fundamental gap between what these systems can do and what we would consider true understanding, because"

npx tsx playground/text_continuation/index.ts --input "Growing up in a small farming town, Maria never imagined she would end up leading a research team at one of the world's top universities. Her parents worked long hours in the fields and could barely afford school supplies. But her math teacher saw something in her — a quiet persistence, a hunger for problems that didn't have easy answers — and encouraged her to"
```

## Very long input

```bash
npx tsx playground/text_continuation/index.ts --input "The history of cryptography stretches back thousands of years. The ancient Egyptians used simple substitution ciphers to protect sacred texts. The Romans developed the Caesar cipher, shifting each letter by a fixed number of positions. During the Renaissance, polyalphabetic ciphers emerged, making frequency analysis far more difficult. By the 20th century, mechanical encryption devices like the Enigma machine had raised the stakes enormously. Breaking Enigma required the combined efforts of Polish mathematicians and British codebreakers at Bletchley Park, led by Alan Turing. Their success shortened the war by an estimated two years. After the war, cryptography moved into the digital realm. The invention of public-key cryptography in the 1970s revolutionized secure communication, enabling strangers to exchange secrets over open channels without ever meeting in person."

npx tsx playground/text_continuation/index.ts --input "Tokyo is a city of contradictions. Ancient temples sit in the shadow of glass skyscrapers. Quiet residential streets give way to the neon chaos of Shibuya and Shinjuku within a single block. The trains run with a precision measured in seconds, yet the city itself feels like it could spin off its axis at any moment. In the morning, salarymen in dark suits file silently into stations. By evening, the same streets are alive with music, laughter, and the warm glow of izakayas tucked beneath railway arches. Street vendors sell taiyaki and yakitori while Michelin-starred restaurants hide behind unmarked doors. The city never stops reinventing itself — demolishing, rebuilding, layering the new over the old in ways that somehow preserve both. It is a place where tradition and innovation do not compete but coexist, each making the other more vivid."

npx tsx playground/text_continuation/index.ts --input "The concept of time has puzzled philosophers and scientists for millennia. Aristotle believed time was simply the measure of change — without motion, there could be no time. Newton saw it differently, arguing that time flows uniformly regardless of what happens in the physical world. Einstein shattered both views with his theory of relativity, showing that time is not absolute but bends with gravity and speed. A clock on a mountaintop ticks faster than one at sea level. An astronaut traveling near the speed of light would age more slowly than her twin on Earth. Quantum mechanics adds yet another layer of strangeness. At the subatomic level, the distinction between past and future seems to dissolve entirely. Some equations work equally well in both directions. The arrow of time, so obvious in our daily experience, becomes a deep mystery at the foundations of physics. We feel time passing, yet no one can fully explain why it moves in only one direction."
```

## Incomplete words

```bash
npx tsx playground/text_continuation/index.ts --input "The tele"
npx tsx playground/text_continuation/index.ts --input "She was incredi"
npx tsx playground/text_continuation/index.ts --input "The govern"
npx tsx playground/text_continuation/index.ts --input "It was an unforg"
npx tsx playground/text_continuation/index.ts --input "The astro"
npx tsx playground/text_continuation/index.ts --input "They walked through the neigh"
npx tsx playground/text_continuation/index.ts --input "He opened his laptop and started typ"
npx tsx playground/text_continuation/index.ts --input "The experiment produced unexpe"
```
