# Content Enhancer Agent Examples

LangGraph pipeline that enhances and improves existing text. Use `--level` / `-l` to control enhancement intensity: `light`, `moderate`, or `heavy`.

## Enhance Content

Default level is `light` (minimal fixes). Use `--level` / `-l` to control how aggressively the text is improved.

```bash
# light (default — fix errors, small improvements)
npx tsx playground/content_enhancer_agent/index.ts -i "The company have been growing alot since last year and there revenue is up."
npx tsx playground/content_enhancer_agent/index.ts -i "Me and him went to the store for buying some stuffs."
npx tsx playground/content_enhancer_agent/index.ts -i "Il progetto è andato bene pero ci sono stati dei problemi con il budget."

# moderate (polish structure, word choice, transitions)
npx tsx playground/content_enhancer_agent/index.ts -i "The company have been growing alot since last year and there revenue is up." -l moderate
npx tsx playground/content_enhancer_agent/index.ts -i "Technology is changing fast and it affects many things in our daily life in many ways." -l moderate
npx tsx playground/content_enhancer_agent/index.ts -i "Le nuove tecnologie stanno cambiando il modo in cui lavoriamo e questo è importante per il futuro." -l moderate

# heavy (thorough rewrite for maximum clarity and impact)
npx tsx playground/content_enhancer_agent/index.ts -i "The company have been growing alot since last year and there revenue is up." -l heavy
npx tsx playground/content_enhancer_agent/index.ts -i "There are many reasons why people should exercise more because it is good for health and also helps with mental wellbeing and stuff like that." -l heavy
npx tsx playground/content_enhancer_agent/index.ts -i "Die neue Software hat viele Funktionen aber sie ist nicht so einfach zu benutzen fuer die meisten Leute." -l heavy
```
