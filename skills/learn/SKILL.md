---
name: learn
description: Interactive learning mode. Teaches by doing with verified code, adaptive difficulty, and Socratic questioning.
argument-hint: [topic]
---

# Learn Mode v2.0

> Learn by doing. Verified at every step. Adapted to your level.

## Activation

`/learn "topic"` — e.g., `/learn "JWT auth in Express"`, `/learn "React custom hooks"`

---

## Phase 1: INIT (auto, no user interaction needed)

1. **Resume check**: Look in `learn/` for existing file matching topic. If found, read its YAML frontmatter and offer to resume from last checkpoint via `AskUserQuestion`.

2. **Language detection**: Scan project for config files to identify primary language.

| Language | Config Files | Verify: Syntax | Verify: Run/Test |
|----------|-------------|----------------|------------------|
| TypeScript | tsconfig.json | `npx tsc --noEmit` | `npx tsx <file>` |
| JavaScript | package.json, *.mjs | `node --check <file>` | `node <file>` |
| Python | pyproject.toml, requirements.txt | `python -m py_compile <file>` | `python <file>` |
| Go | go.mod | `go build ./...` | `go test ./...` |
| Rust | Cargo.toml | `cargo check` | `cargo test` |
| Java | pom.xml, build.gradle | `javac <file>` | `./gradlew test` |
| Kotlin | build.gradle.kts | `kotlinc <file>` | `./gradlew test` |
| C#/Unity | *.csproj, *.sln | `dotnet build` | `dotnet test` |
| Dart/Flutter | pubspec.yaml | `dart analyze` | `flutter test` |
| Swift | Package.swift | `swift build` | `swift test` |
| PHP | composer.json | `php -l <file>` | `php <file>` |
| Ruby | Gemfile | `ruby -c <file>` | `ruby <file>` |
| Elixir | mix.exs | `mix compile` | `mix test` |
| Zig | build.zig | `zig build` | `zig build test` |
| Lua | *.lua | `luac -p <file>` | `lua <file>` |
| Shell | *.sh | `bash -n <file>` | `bash <file>` |
| C/C++ | Makefile, CMakeLists.txt | `make` | `make test` |

If multiple detected → ask user. If none → ask user.

3. **Codebase scan**: Read key project files (entry points, configs, existing code related to topic) for context. Use project's conventions in all examples.

4. **Mode from codingLevel** (read from `.claude/.ck.json`):
   - Level 0-1 → **Deep**: full concepts, analogies, Socratic questions at every step
   - Level 2-3 → **Standard**: concepts + code, balanced explanations
   - Level 4-5 → **Quick**: minimal explanation, jump straight to code
   - Not set → ask user with `AskUserQuestion`

5. **Create output file**: `learn/{YYYY-MM-DD}-{topic-slug}.md` with YAML frontmatter:
```yaml
---
topic: "{topic}"
language: {detected}
phase: INIT
step: 0
total_steps: 0
mode: {deep|standard|quick}
started: {ISO timestamp}
updated: {ISO timestamp}
---
```

---

## Phase 2: LEARN (skip entirely in Quick mode)

1. **WebSearch** official docs: `WebSearch("{topic} {language} official documentation")`, then `WebFetch` the most relevant result. Cite sources in tutorial.

2. **Socratic opening** (Deep/Standard): Before explaining, ask user via `AskUserQuestion`:
   > "Before I explain — what do you think {concept} does and why it's useful?"
   Then build on their answer.

3. **Explain concepts** using the project's actual code as examples where possible. Cover: what it is, why it exists, how it works.

4. **Checkpoint**: `AskUserQuestion` — "Concepts clear? Continue to building?"

Update frontmatter: `phase: LEARN`

---

## Phase 3: BUILD (core phase)

1. **Plan steps**: Break implementation into 3-7 verifiable steps. Show plan to user.

2. **For each step**:

   a. **Explain** what we're doing and why (skip in Quick mode)

   b. **Write real code** — no placeholders, no pseudocode. Use project conventions. Use `Edit` for existing files, `Write` for new files.

   c. **Tiered verify**:
      - Always: run syntax check command from table above
      - When possible: run the code
      - If test framework detected: write/run a test

   d. **Socratic** (Deep mode only): Ask "Why did we use X instead of Y?" via `AskUserQuestion`

   e. **Checkpoint**: `AskUserQuestion` — "Step {N}/{total} verified. Understood?"
      - If user reports error → debug, fix, re-verify, update tutorial
      - If user needs explanation → explain, then continue

   f. **Write to tutorial file**: step title, explanation, code, key points, verify result

   Update frontmatter: `phase: BUILD`, `step: {N}`, `total_steps: {total}`

---

## Phase 4: WRAP-UP

1. **Summary**: What was built, key takeaways (3-5 points)

2. **Quiz** (optional): Ask user via `AskUserQuestion` if they want a quiz.
   If yes: 3-4 questions (conceptual, code reading, debugging). Use `AskUserQuestion` for each.

3. **Save tutorial**: Finalize the markdown file. Update frontmatter: `phase: COMPLETE`

4. **Next topics**: Suggest 2-3 related topics to learn next.

Display: `Tutorial saved: learn/{filename}.md`

---

## Principles

1. **Verify everything** — never assume code works
2. **Real code only** — no placeholders, no pseudocode
3. **User controls pace** — always checkpoint before proceeding
4. **Teach with their code** — use project's actual codebase, not generic examples

---

## Error Handling

- **Verify tool missing**: Ask user to install or switch to manual verification
- **Code doesn't work on user's machine**: Get error message, debug, fix, re-verify, update tutorial
- **Language not detected**: Ask user to specify, set verify strategy accordingly

---

## Version History

- **2.0.0** - Rewrite: adaptive difficulty via codingLevel, 4 phases, WebSearch, Socratic method, resume support, tiered verify, 17 languages, codebase-aware
- **1.0.0** - Initial release
