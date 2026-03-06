# Agent Graph Architecture

The project contains two LangGraph state graphs: the **Writing Graph** (main continuation agent) and the **Marker Writer Graph** (marker-based writing agent).

---

## Writing Graph

A write–evaluate–rewrite loop that generates text continuations and iteratively improves them based on evaluator feedback.

```
START
  │
  ▼
writer ──────► evaluator
  ▲                │
  │            (conditional)
  │               / \
  │     failed   /   \  passed OR
  │     ────────┘     │ max iterations
  │                   ▼
  │               formatter
  │                   │
  │                   ▼
  │                  END
  │
  └── retry loop (up to maxIterations)
```

### Nodes

| Node | File | Description |
| --- | --- | --- |
| **writer** | `src/nodes/writer.ts` | Generates a 200–400 word continuation of the input text using an LLM. On retries, incorporates evaluator feedback to revise the output. |
| **evaluator** | `src/nodes/evaluator.ts` | Scores the continuation on coherence, style consistency, quality, and flow (0–10). Returns a `passed` boolean based on the configured `passThreshold` (default 7). |
| **formatter** | `src/nodes/formatter.ts` | Lightly polishes the final continuation — fixes phrasing and flow without altering meaning. |

### Routing

The **router** function (`src/graph.ts`) runs after the evaluator:

- If `passed === true` → route to **formatter**
- If `iteration >= maxIterations` → route to **formatter** with best attempt
- Otherwise → route back to **writer** for another revision

### State

Defined in `src/state.ts`:

| Field | Type | Purpose |
| --- | --- | --- |
| `inputText` | `string` | Original text to continue |
| `continuation` | `string` | Generated continuation |
| `formattedContinuation` | `string` | Polished final output |
| `evaluationScore` | `number` | Score from evaluator (0–10) |
| `evaluationFeedback` | `string` | Feedback for revision |
| `passed` | `boolean` | Whether the continuation passed evaluation |
| `iteration` | `number` | Current iteration (auto-increments) |
| `maxIterations` | `number` | Maximum allowed iterations (default 3) |
| `history` | `AttemptRecord[]` | Log of all attempts with scores and feedback |

---

## Marker Writer Graph

A linear pipeline that takes a document with a Unicode marker at the cursor position, analyzes the context, plans the writing, generates text, and stitches the result back into the document.

```
START
  │
  ▼
input_parser
  │
  ▼
intent_analyzer
  │
  ▼
style_analyzer
  │
  ▼
planner
  │
  ▼
writer
  │
  ▼
stitcher
  │
  ▼
END
```

### Nodes

| Node | File | Description |
| --- | --- | --- |
| **input_parser** | `src/marker_writer/nodes/input-parser.ts` | Pure logic (no LLM). Finds Unicode markers in the raw input, classifies the marker position (e.g. `END_OF_TEXT`, `MID_SENTENCE`, `BETWEEN_BLOCKS`), determines the operation type, and extracts surrounding context. |
| **intent_analyzer** | `src/marker_writer/nodes/intent-analyzer.ts` | Determines what the user wants written — content type, topic, audience, tone, length, and constraints. Uses heuristics for simple continuations, LLM for complex cases. |
| **style_analyzer** | `src/marker_writer/nodes/style-analyzer.ts` | Analyzes the existing text's writing style — tone, sentence length, paragraph style, vocabulary, point of view, tense, and notable patterns. Returns defaults for short documents (<50 words). |
| **planner** | `src/marker_writer/nodes/planner.ts` | Creates a writing plan: approach, topics to cover, transitions in/out, constraints, and target word count. Accounts for position-specific requirements (e.g. completing a mid-sentence, bridging to existing text). |
| **writer** | `src/marker_writer/nodes/writer.ts` | Generates the text using position-specific instructions, the style profile, and the writing plan. Produces only the insertion text with no meta-commentary. |
| **stitcher** | `src/marker_writer/nodes/stitcher.ts` | Pure logic (no LLM). Assembles the final document by inserting the generated text at the marker position with appropriate separators based on the operation type. |

### Markers

Defined in `src/marker_writer/markers.ts`. Uses Unicode Private Use Area characters (invisible to users, machine-parseable):

| Marker | Code Point | Purpose |
| --- | --- | --- |
| `CONTINUE` | `U+E000` | Write new content at this position |
| `REWRITE_START` / `REWRITE_END` | `U+E001` / `U+E002` | Mark region to rewrite |
| `ENHANCE_START` / `ENHANCE_END` | `U+E003` / `U+E004` | Mark region to enhance |
| `DELETE_START` / `DELETE_END` | `U+E005` / `U+E006` | Mark region to delete |
| `COMMENT` | `U+E007` | Inline comment/instruction |

### Marker Positions

The input parser classifies the marker into one of these positions (`src/marker_writer/types.ts`):

| Position | Pattern | Operation |
| --- | --- | --- |
| `END_OF_TEXT` | `text text text█` | `CONTINUE` |
| `START_OF_TEXT` | `█text text text` | `PREPEND` |
| `BETWEEN_BLOCKS` | `text\n\n█\n\ntext` | `BRIDGE` |
| `MID_PARAGRAPH` | `text. █text. text` | `BRIDGE` |
| `MID_SENTENCE` | `text word█ word text` | `BRIDGE` |
| `AFTER_HEADING` | `## Heading\n█` | `FILL_SECTION` |
| `BEFORE_HEADING` | `text\n█\n## Heading` | `BRIDGE` |
| `INLINE_END` | `text█\nmore text` | `BRIDGE` |
| `EMPTY_DOCUMENT` | `█` | `GENERATE` |
| `BETWEEN_LINES` | `line1\n█\nline2` | `BRIDGE` |
| `REGION_SELECTED` | `text⟨START⟩sel⟨END⟩text` | `*_REGION` |

### State

Defined in `src/marker_writer/state.ts`:

| Field | Type | Set By |
| --- | --- | --- |
| `rawInput` | `string` | Caller |
| `userInstruction` | `string` | Caller |
| `knowledgeBasePath` | `string` | Caller |
| `parsedInput` | `ParsedInput` | input_parser |
| `intentAnalysis` | `object` | intent_analyzer |
| `styleProfile` | `object` | style_analyzer |
| `writingPlan` | `object` | planner |
| `generatedText` | `string` | writer |
| `finalDocument` | `string` | stitcher |
| `changeDescription` | `string` | stitcher |
| `userPreferences` | `Record<string, string>` | Memory (accumulates) |
| `conversationHistory` | `Array<{role, content}>` | Memory (accumulates) |
