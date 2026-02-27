---
description: ⚡⚡⚡ Plan parallel phases & execute with fullstack-developer agents
argument-hint: [tasks]
---

**Ultrathink parallel** to implement: <tasks>$ARGUMENTS</tasks>

**IMPORTANT:** Activate needed skills. Ensure token efficiency. Sacrifice grammar for concision.

## Workflow

### 1. Research (Optional)
- Use max 2 Task agents for research in parallel if tasks complex
- Use `/scout:ext` to search codebase
- Keep reports ≤150 lines

### 2. Parallel Planning
- Trigger `/plan:parallel <detailed-instruction>`
- Wait for plan with dependency graph, execution strategy, file ownership matrix

### 3. Parallel Implementation
- Read `plan.md` for dependency graph
- Launch multiple Task agents for fullstack development in PARALLEL for concurrent phases
  - Example: "Phases 1-3 parallel" → launch 3 Task agents simultaneously
  - Pass phase file path: `{plan-dir}/phase-XX-*.md`
  - Include environment info
- Wait for all parallel phases complete before dependent phases
- Sequential phases: launch one agent at a time

### 4. Testing
- Use a Task agent for testing for full test suite
- NO fake data/mocks/cheats
- If fail: use Task agent for debugging, fix, repeat

### 5. Code Review
- Use Task agent for code review for all changes
- If critical issues: fix, retest

### 6. Project Management & Docs
- If approved: use Task agent for project management + Task agent for documentation in parallel
- Update plan files, docs, roadmap
- If rejected: fix and repeat

### 7. Final Report
- Summary of all parallel phases
- Guide to get started
- Ask to commit (use Task agent for git operations if yes)

**Example:** Phases 1-3 parallel → Launch 3 Task agents for fullstack development → Wait → Phase 4 sequential
