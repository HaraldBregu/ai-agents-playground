# CLAUDE.md

## Formatting

After each file edit, run `yarn format` to format the code with Prettier.

## File Naming Conventions

- **`.ts`** files: lowercase kebab-case (e.g., `my-component.ts`)
- **`.tsx`** files: PascalCase (e.g., `MyComponent.tsx`)
- **`.md`** files: UPPERCASE or UPPER_SNAKE_CASE (e.g., `README.md`, `GETTING_STARTED.md`)
- **`.json`** files: kebab-case, or lowercase if a single word (e.g., `tsconfig.json`, `my-config.json`)
- **Folders**: lowercase snake_case (e.g., `my_folder`, `user_settings`)

## Comments

- Only write comments that explain **why**, not **what** — the code should be self-explanatory.
- Avoid obvious, redundant, or boilerplate comments (e.g., `// constructor`, `// returns the value`).
- Do not add JSDoc or inline comments unless the logic is non-trivial or could confuse a future reader.

## SonarQube Compliance

After implementation, always verify that the code respects SonarQube rules:

- **No code smells**: avoid duplicated code, overly complex functions (cyclomatic complexity), and long methods/files.
- **No bugs**: no null dereferences, no unreachable code, no identical expressions on both sides of an operator.
- **No vulnerabilities**: no hardcoded credentials, no SQL injection, no XSS, no insecure crypto, no open redirects.
- **No security hotspots**: review usages of regex, HTTP requests, file I/O, and dynamic code execution.
- **Maintainability**: keep cognitive complexity low, extract functions when complexity grows, prefer early returns over deep nesting.
- **Reliability**: handle all promise rejections, avoid empty catch blocks, do not ignore return values of critical functions.
- **Code coverage**: new logic should be testable and covered by tests when a test suite exists.
