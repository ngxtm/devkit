---
name: learn
description: Interactive step-by-step learning mode. Teaches concepts from basics to advanced while solving real problems. Auto-detects language, verifies code at each step, creates markdown tutorials. Triggers on "/learn [topic]". Features: concept explanation, incremental coding with auto-verify, user checkpoints, optional quiz, saves tutorial to .claude/learn/.
---

# Learn Mode - Interactive Step-by-Step Learning

> **Version 1.0.0** | Learn by Doing | Verified at Every Step

---

## Overview

Learn Mode helps you understand concepts deeply while solving real problems. Instead of just giving you code, it:

1. Explains concepts from basics to advanced
2. Guides you through implementation step-by-step
3. Verifies code actually works at each step
4. Saves everything to a markdown tutorial for future reference

---

## Activation

User invokes with: `/learn "topic or problem to solve"`

Examples:
- `/learn "implement debounce function in TypeScript"`
- `/learn "add JWT authentication to Express API"`
- `/learn "create custom React hook for form validation"`

---

## Execution Flow

### Phase 0: INIT - Setup & Context Gathering

**Actions:**
1. Create output directory if not exists: `.claude/learn/`
2. Generate filename: `YYYY-MM-DD-{topic-slug}.md`
3. Scan project for language detection:
   - Check for config files: `tsconfig.json`, `package.json`, `go.mod`, `Cargo.toml`, `requirements.txt`, `pyproject.toml`, `pom.xml`, `composer.json`, `Gemfile`, etc.
   - Identify primary language(s)
4. Set verify strategy based on detected language
5. Read relevant existing code for context

**Language Detection & Verify Strategy:**

| Language | Config Files | Verify Command |
|----------|--------------|----------------|
| TypeScript | `tsconfig.json`, `*.ts`, `*.tsx` | `npx tsc --noEmit` |
| JavaScript | `package.json`, `*.js`, `*.mjs` | `node --check <file>` |
| Python | `requirements.txt`, `pyproject.toml`, `*.py` | `python -m py_compile <file>` |
| Go | `go.mod`, `*.go` | `go build ./...` |
| Rust | `Cargo.toml`, `*.rs` | `cargo check` |
| Java | `pom.xml`, `build.gradle`, `*.java` | `javac <file>` or `./gradlew compileJava` |
| C# | `*.csproj`, `*.cs` | `dotnet build --no-restore` |
| PHP | `composer.json`, `*.php` | `php -l <file>` |
| Ruby | `Gemfile`, `*.rb` | `ruby -c <file>` |
| Shell | `*.sh`, `*.bash` | `bash -n <file>` |
| C/C++ | `Makefile`, `CMakeLists.txt`, `*.c`, `*.cpp` | `make` or `cmake --build .` |

**If multiple languages detected:** Ask user which one to use for this session.
**If no language detected:** Ask user to specify.

**Markdown Header (write to file):**
```markdown
# Learn: {Topic}

> Generated: {YYYY-MM-DD HH:MM}
> Language: {detected_language}
> Project: {project_name}

---
```

---

### Phase 1: CONCEPT - Knowledge Foundation

**Goal:** Explain the underlying concepts before writing any code.

**Actions:**
1. Break down the topic into fundamental concepts
2. Explain each concept clearly:
   - What is it?
   - Why does it exist? What problem does it solve?
   - How does it work (high-level)?
   - Real-world analogies if helpful
3. Compare with related concepts (if applicable)
   - e.g., debounce vs throttle
   - e.g., JWT vs session-based auth
4. Show simple diagrams using ASCII if helpful

**Write to markdown:**
```markdown
## 1. Concepts

### What is {topic}?
{explanation}

### Why use {topic}?
{use cases and benefits}

### How it works
{mechanism explanation}

### Related Concepts
| Concept A | Concept B |
|-----------|-----------|
| ...       | ...       |

---
```

**User Checkpoint:**
```
Phase 1/5: CONCEPT complete.

Do you understand these concepts?
[ ] Yes, continue to planning
[ ] Need more explanation (specify what)
```

**STOP and wait for user response before proceeding.**

---

### Phase 2: PLAN - Implementation Strategy

**Goal:** Create a clear, step-by-step implementation plan.

**Actions:**
1. Break implementation into small, verifiable steps (3-7 steps typically)
2. Each step should:
   - Have a clear goal
   - Be independently verifiable
   - Build on previous steps
3. Identify files to create/modify
4. Note any dependencies needed

**Write to markdown:**
```markdown
## 2. Implementation Plan

### Files
- `{path/to/file1}` - {purpose}
- `{path/to/file2}` - {purpose}

### Steps
1. **{Step 1 title}** - {brief description}
2. **{Step 2 title}** - {brief description}
3. **{Step 3 title}** - {brief description}
...

### Dependencies
- {dependency 1} - {why needed}
- {dependency 2} - {why needed}

---
```

**User Checkpoint:**
```
Phase 2/5: PLAN complete.

Ready to start coding?
[ ] Yes, let's code
[ ] Modify plan (specify changes)
```

**STOP and wait for user response before proceeding.**

---

### Phase 3: CODE + VERIFY - Incremental Implementation

**Goal:** Implement each step, verify it works, ensure user understands.

**For each step in the plan:**

#### 3.1 Explain Before Coding
- What we're about to do
- Why we're doing it this way
- Key things to understand

#### 3.2 Write the Code
- Write complete, working code (no placeholders)
- Include all necessary imports
- Add inline comments explaining non-obvious parts
- Use Edit tool to modify existing files, Write for new files

#### 3.3 Auto-Verify
Run the appropriate verify command:
```bash
# Execute verify command based on language
{verify_command}
```

**If verify FAILS:**
1. Analyze the error
2. Explain what went wrong (teaching moment)
3. Fix the code
4. Re-verify
5. Repeat until pass

**If verify PASSES:** Continue to user checkpoint.

#### 3.4 Write to Markdown
```markdown
### Step {N}: {Title}

**Goal:** {what this step accomplishes}

**Why:** {explanation of approach}

**Code:**
```{language}
{code with comments}
```

**Key Points:**
- {important thing 1}
- {important thing 2}

**Verify:** {verify_command} - PASSED

---
```

#### 3.5 User Checkpoint
```
Step {N}/{total} complete and verified.

[ ] Understood, next step
[ ] Need more explanation
[ ] Code doesn't work on my machine (paste error)
```

**If user reports error:**
1. Ask for the error message
2. Debug and fix
3. Re-verify locally
4. Update the markdown with the fix

**STOP and wait for user response before next step.**

---

### Phase 4: SUMMARY - Knowledge Consolidation

**Goal:** Reinforce learning with summary and best practices.

**Actions:**
1. Summarize what was built
2. List key takeaways
3. Document common mistakes to avoid
4. Suggest next steps for deeper learning

**Write to markdown:**
```markdown
## 4. Summary

### What We Built
{summary of implementation}

### Key Takeaways
1. {takeaway 1}
2. {takeaway 2}
3. {takeaway 3}

### Common Mistakes to Avoid
- {mistake 1} - {why it's bad}
- {mistake 2} - {why it's bad}

### Next Steps
- {suggestion for further learning 1}
- {suggestion for further learning 2}

---
```

**User Checkpoint:**
```
Phase 4/5: SUMMARY complete.

Would you like to take a quiz to reinforce learning?
[ ] Yes, quiz me
[ ] No, finish up
```

---

### Phase 5: QUIZ (Optional)

**Goal:** Test understanding with practical questions.

**Only if user opted in.**

**Question Types:**
1. **Conceptual:** Test understanding of the "why"
2. **Code Reading:** Given code, predict behavior
3. **Code Writing:** Small exercise to implement variation
4. **Debugging:** Find the bug in given code

**Format:**
```
QUIZ MODE

Q1 (Conceptual): {question}

Your answer: [wait for user]

---

Correct answer: {answer}
Explanation: {why}

Score: {X}/4
```

**Write to markdown:**
```markdown
## 5. Quiz

<details>
<summary>Q1: {question}</summary>

**Answer:** {answer}

**Explanation:** {explanation}
</details>

<details>
<summary>Q2: {question}</summary>
...
</details>

---
```

---

### Phase 6: COMPLETE

**Actions:**
1. Finalize markdown file
2. Display completion message

**Add to markdown:**
```markdown
---

> Tutorial completed: {timestamp}
> Total steps: {N}
> All code verified and working

Happy coding!
```

**Display to user:**
```
LEARN MODE COMPLETE

Tutorial saved: .claude/learn/{filename}.md
You can review this file anytime to refresh your knowledge.

What you learned:
- {concept 1}
- {concept 2}
- {concept 3}

Great job!
```

---

## Error Handling

### Verify Command Not Available
If the verify command fails because tool is not installed:
1. Inform user: "Verify tool not available: {command}"
2. Ask: "Install it now, or proceed with manual verification?"
3. If install: run appropriate install command
4. If manual: ask user to confirm code works after each step

### User Reports Code Doesn't Work
1. Ask for exact error message
2. Ask for their environment (OS, versions)
3. Debug systematically
4. Update tutorial with fix
5. Add to "Common Issues" section in markdown

### Language Not Detected
1. List common languages
2. Ask user to specify
3. Set verify strategy accordingly

---

## Principles

1. **No code without understanding** - Always explain before implementing
2. **Verify everything** - Never assume code works, always test
3. **Fix before proceed** - Don't move on until current step works
4. **User controls pace** - Always checkpoint before next phase
5. **Document for future** - Create reusable tutorial
6. **Basics to advanced** - Start simple, build up complexity
7. **Real working code** - No pseudocode, no placeholders

---

## Example Session

```
User: /learn "implement debounce in TypeScript"

[INIT]
Detected: TypeScript (tsconfig.json found)
Verify command: npx tsc --noEmit
Creating: .claude/learn/2024-02-06-debounce-typescript.md

[CONCEPT]
Debounce is a technique that delays executing a function until
after a specified time has passed since the last call...
[detailed explanation]

Ready to continue? [Yes/Explain more]

User: Yes

[PLAN]
Step 1: Create utils/debounce.ts with basic structure
Step 2: Implement core debounce logic
Step 3: Add TypeScript generics for type safety
Step 4: Write unit tests

Ready to code? [Yes/Modify plan]

User: Yes

[CODE Step 1/4]
Creating utils/debounce.ts...
[code with explanation]

Verifying: npx tsc --noEmit
PASSED

Understood? [Yes/Explain more/Error on my machine]

User: Yes

[CODE Step 2/4]
...

[After all steps]

[SUMMARY]
Key takeaways:
1. Debounce delays execution until activity stops
2. clearTimeout prevents stale callbacks
3. Generics preserve function type signatures

Quiz? [Yes/No]

User: No

COMPLETE
Tutorial saved: .claude/learn/2024-02-06-debounce-typescript.md
```

---

## Version History

- **1.0.0** - Initial release with full interactive learning flow
