---
name: learn
description: Guided project building — you code, AI mentors. Build your own product step-by-step with best practices and deep understanding.
argument-hint: [topic] [--plan <path>]
---

# Learn Mode v3.2

> Build your product. Design the architecture. Write every line. Understand every decision.

## Activation

`/learn "topic"` — e.g., `/learn "JWT auth in Express"`, `/learn "build real-time chat"`
`/learn --plan <path>` — Learn by following an existing plan (topic auto-extracted from plan title)
`/learn "topic" --plan <path>` — Learn with custom topic + existing plan

e.g., `/learn --plan plans/skill-sync-rewrite/plan.md`
e.g., `/learn "upstream sync" --plan plans/skill-sync-rewrite/plan.md`

---

## Phase 1: INIT (auto, no user interaction needed)

1. **Resume check**: Look in `learn/` for existing file matching topic. If found, read its YAML frontmatter and offer to resume from last checkpoint via `AskUserQuestion`.

2. **Plan import check**: If arguments contain `--plan <path>`:
   a. Read the plan file at `<path>`. Validate it exists and has content.
   b. **Topic resolution**: If no topic provided in arguments, extract from plan's YAML frontmatter `title` field.
   c. Detect plan structure:
      - **Single-file plan**: no `phase-XX` files referenced → tasks = plan's task list
      - **Multi-phase plan**: has `## Phases` table with phase-XX links → each phase = potential learn module
   d. If multi-phase: ask user via `AskUserQuestion` which phase(s) to learn.
   e. Read selected phase file(s) for detailed tasks.
   f. Store parsed steps for REVIEW phase.

3. **Language detection** (skip if `--plan` already implies language from plan context): Scan project for config files to identify primary language.

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

4. **Difficulty from codingLevel** (read from `.claude/.ck.json`):
   - Level 0-1 → **Deep**: full concepts, analogies, Socratic questions at every step
   - Level 2-3 → **Standard**: concepts + code, balanced explanations
   - Level 4-5 → **Quick**: minimal explanation, jump straight to code
   - Not set → ask user with `AskUserQuestion`

5. **Teaching mode** — ask user via `AskUserQuestion`:

| Mode | Who codes? | AI does what? | Best for |
|------|-----------|---------------|----------|
| **Guided** | User writes all code | Describe task + review after | Deep understanding, own the code |
| **Scaffolded** | User fills in key parts | Provide skeleton + hints | Learning new patterns |
| **Demonstrated** | AI writes, user reads | Write code + explain | Quick overview, reading comprehension |

   Default suggestion based on difficulty: Deep → Guided, Standard → Scaffolded, Quick → Demonstrated.

6. **Create output file**: `learn/{YYYY-MM-DD}-{topic-slug}.md` with YAML frontmatter:
```yaml
---
topic: "{topic}"
language: {detected}
phase: INIT
step: 0
total_steps: 0
difficulty: {deep|standard|quick}
teaching: {guided|scaffolded|demonstrated}
plan_source: "{path or none}"
plan_type: {single|multi-phase|none}
started: {ISO timestamp}
updated: {ISO timestamp}
---
```

---

## Phase 2: LEARN (skip entirely in Quick difficulty)

1. **WebSearch** official docs: `WebSearch("{topic} {language} official documentation")`, then `WebFetch` the most relevant result. Cite sources in tutorial.

2. **Socratic opening** (Deep/Standard): Before explaining, ask user via `AskUserQuestion`:
   > "Before I explain — what do you think {concept} does and why it's useful?"
   Then build on their answer.

3. **Explain concepts** using the project's actual code as examples where possible. Cover: what it is, why it exists, how it works.

4. **Checkpoint**: `AskUserQuestion` — "Concepts clear? Continue to building?"

Update frontmatter: `phase: LEARN`

---

## Phase 3-ALT: REVIEW (only when --plan provided, replaces Phase 3 + 4)

> Understand the plan before building. Light touch — not redesign.

1. **Summarize**: Present plan overview to user:
   > "This plan proposes: {overview}. It has {N} steps targeting {files}."
   > Key decisions: {list key decisions from plan}

2. **Socratic check** (skip in Quick difficulty): Ask 1-2 questions via `AskUserQuestion`:
   > "Before we start — why do you think {first step} comes before {later step}?"
   > OR "What problem does {key decision} solve?"
   Build on user's answer. Correct misconceptions if any.

3. **Adapt**: Ask via `AskUserQuestion`:
   > "Want to reorder, skip, or add any steps? Or proceed as-is?"
   Adjust step list based on user feedback.

4. **Write to tutorial file**: Record plan source, overview, and adapted steps.

Update frontmatter: `phase: REVIEW`, `total_steps: {N}`

---

## Phase 3: DESIGN (Socratic architecture thinking)

> **Skip this phase entirely if `--plan` was provided.** Go to Phase 3-ALT: REVIEW instead.

1. **Frame the problem**: AI presents the high-level problem to solve:
   > "We need to build {topic}. Before I suggest anything — how would YOU approach this? What components or pieces do you think we need?"

   Ask via `AskUserQuestion`. Let user think and answer.

2. **Build on user's answer**:
   - If user's approach is solid → acknowledge strengths, refine together
   - If user's approach has gaps → ask guiding questions: "What about {concern}? How would you handle that?"
   - If user has no idea → break it down: "Let's start smaller — what's the first thing a user would do with this feature?"

3. **Explore alternatives**: Present 2-3 different approaches with trade-offs:
   > "Your approach uses X. Another option is Y. Here's how they compare:"

   | Aspect | Approach A (user's) | Approach B | Approach C |
   |--------|-------------------|-----------|-----------|
   | Complexity | ... | ... | ... |
   | Scalability | ... | ... | ... |
   | Learning value | ... | ... | ... |

   Ask user to choose via `AskUserQuestion`. Explain WHY each trade-off matters.

4. **Architecture decisions**: For the chosen approach, walk through key decisions:
   - Data flow: how data moves through the system
   - File/module structure: where code lives and why
   - Dependencies: what libraries/tools and why those specifically
   - Patterns: which design patterns and why (not just "use MVC" but why MVC fits here)

   For each decision, ask user: "Does this make sense? Any concerns?"

5. **Write to tutorial file**: Record the design discussion, chosen approach, and rationale.

Update frontmatter: `phase: DESIGN`

---

## Phase 4: PLAN (concrete implementation steps)

> **Skip this phase entirely if `--plan` was provided.** Steps come from REVIEW phase instead.

1. **Break down the chosen design** into 3-7 concrete, verifiable steps. Each step should:
   - Have a clear goal (what's done when this step is complete)
   - Build on previous steps (incremental, testable progress)
   - Be small enough to verify immediately

2. **Show plan to user** with rationale for the ordering:
   > "Here's the build order. We start with X because Y depends on it. Step 3 before Step 4 because..."

3. **User validates**: Ask via `AskUserQuestion`:
   > "Does this plan make sense? Want to reorder anything or add/remove steps?"

   Adjust plan based on user feedback.

4. **Write plan to tutorial file**: Each step with goal, files involved, and acceptance criteria.

Update frontmatter: `phase: PLAN`, `total_steps: {N}`

---

## Phase 5: BUILD (core phase)

> If `--plan` was provided, steps come from REVIEW phase (imported plan).
> If no `--plan`, steps come from Phase 4 (PLAN) as usual.
> Everything else in BUILD works identically for both paths.

1. **For each step from the PLAN phase, follow the teaching mode**:

### Guided Mode (user codes everything)

   a. **Describe the task**: Explain WHAT to implement and WHY. Include:
      - The goal of this step
      - Which file(s) to create or modify
      - Key concepts/APIs to use
      - Acceptance criteria (what "done" looks like)
      - **Do NOT show the solution code.**

   b. **User codes**: Tell user to write the code. Wait for them to say "done" or ask for help.
      - If user asks for a hint → give a small hint, not the full answer
      - If user is stuck after 2 hints → offer to show one specific part

   c. **AI reviews**: Read the file(s) user modified. Provide:
      - Does it work? Run verify commands.
      - Best-practice review: naming, patterns, security, performance
      - Specific feedback: "Line X: consider Y because Z"
      - If issues found → explain and let user fix (don't fix for them)

   d. **Socratic**: "Why did you choose this approach?" or "What happens if X fails?" via `AskUserQuestion`

### Scaffolded Mode (AI provides skeleton, user fills in)

   a. **Explain** what we're building and why

   b. **Write skeleton code** with clearly marked `// TODO: implement` sections. Use `Edit`/`Write` tools. The skeleton should include:
      - File structure and imports
      - Function signatures with parameter types
      - Comments describing what each TODO section should do
      - Keep TODOs focused (each is 3-15 lines of real code)

   c. **User fills in TODOs**: Wait for user to complete them.

   d. **AI reviews**: Read filled-in code. Same review process as Guided mode.

### Demonstrated Mode (AI codes, user reads)

   a. **Explain** what we're doing and why

   b. **Write real code** — no placeholders, no pseudocode. Use project conventions. Use `Edit` for existing files, `Write` for new files.

   c. **Explain key decisions**: After writing, highlight WHY specific choices were made.

### All Modes — after coding:

   e. **Tiered verify**:
      - Always: run syntax check command from language table
      - When possible: run the code
      - If test framework detected: write/run a test

   f. **Best-practice review** (all modes): Check the completed code for:
      - Security issues (injection, XSS, exposed secrets)
      - Anti-patterns for the language/framework
      - Naming and convention consistency with project
      - Performance concerns
      - Present findings to user with explanations

   g. **Checkpoint**: `AskUserQuestion` — "Step {N}/{total} verified. Ready for next?"
      - If user reports error → debug together (Guided: guide user to fix; Demonstrated: fix directly)
      - If user needs explanation → explain, then continue

   h. **Explain-back check** (every 2-3 steps): Ask user via `AskUserQuestion`:
      > "Quick check — can you explain in your own words what we built in the last {N} steps and how they connect?"
      - If user explains well → acknowledge and continue
      - If gaps → re-explain the unclear parts before proceeding

   i. **Write to tutorial file**: step title, explanation, code, key points, verify result

   Update frontmatter: `phase: BUILD`, `step: {N}`, `total_steps: {total}`

---

## Phase 6: WRAP-UP

1. **Summary**: What was built, key takeaways (3-5 points)

2. **Quiz** (optional): Ask user via `AskUserQuestion` if they want a quiz.
   If yes: 3-4 questions (conceptual, code reading, debugging). Use `AskUserQuestion` for each.

3. **Save tutorial**: Finalize the markdown file. Update frontmatter: `phase: COMPLETE`

4. **Next topics**: Suggest 2-3 related topics to learn next.

Display: `Tutorial saved: learn/{filename}.md`

---

## Principles

1. **User owns the code** — in Guided/Scaffolded mode, user writes; AI reviews, never writes for them
2. **Verify everything** — never assume code works
3. **Real code only** — no placeholders, no pseudocode (except Scaffolded TODOs)
4. **User controls pace** — always checkpoint before proceeding
5. **Teach with their code** — use project's actual codebase, not generic examples
6. **Best practices always** — review every step for security, patterns, conventions
7. **Understanding > completion** — if user doesn't understand, stop and re-explain

---

## Error Handling

- **Verify tool missing**: Ask user to install or switch to manual verification
- **Code doesn't work on user's machine**: Get error message, debug together, re-verify, update tutorial
- **Language not detected**: Ask user to specify, set verify strategy accordingly
- **User stuck in Guided mode**: After 2 hints, offer to show solution for that specific part only

---

## Version History

- **3.2.0** - Added --plan flag: import existing plan files, REVIEW phase replaces DESIGN+PLAN for plan-driven learning. Flow with plan: INIT → LEARN → REVIEW → BUILD → WRAP-UP
- **3.1.0** - Added DESIGN phase (Socratic architecture) and PLAN phase (concrete steps). Full flow: INIT → LEARN → DESIGN → PLAN → BUILD → WRAP-UP
- **3.0.0** - Teaching modes (guided/scaffolded/demonstrated), best-practice review, explain-back checkpoints, user-codes-first philosophy
- **2.0.0** - Rewrite: adaptive difficulty via codingLevel, 4 phases, WebSearch, Socratic method, resume support, tiered verify, 17 languages, codebase-aware
- **1.0.0** - Initial release
