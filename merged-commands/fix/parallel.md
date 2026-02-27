---
description: ⚡⚡ Analyze & fix issues with parallel fullstack-developer agents
argument-hint: [issues]
---

**Ultrathink parallel** to fix: <issues>$ARGUMENTS</issues>

**IMPORTANT:** Activate needed skills. Ensure token efficiency. Sacrifice grammar for concision.

## Workflow

### 1. Issue Analysis
- Use a Task agent for debugging: Task(subagent_type="general-purpose", prompt="You are a debugger. Analyze root causes.", description="Analyze root causes") to analyze root causes
- Use `/scout:ext` to find related files
- Categorize issues by scope/area (frontend, backend, auth, payments, etc.)
- Identify dependencies between issues

### 2. Parallel Fix Planning
- Trigger `/plan:parallel <detailed-fix-instructions>` for parallel-executable fix plan
- Wait for plan with dependency graph, execution strategy, file ownership matrix
- Group independent fixes for parallel execution
- Sequential fixes for dependent issues

### 3. Parallel Fix Implementation
- Read `plan.md` for dependency graph
- Launch multiple Task agents for fullstack development in PARALLEL for independent fixes
  - Example: "Fix auth + Fix payments + Fix UI" → launch 3 Task agents simultaneously
  - Pass phase file path: `{plan-dir}/phase-XX-*.md`
  - Include environment info
- Wait for all parallel fixes complete before dependent fixes
- Sequential fixes: launch one agent at a time

### 4. Testing
- Use a Task agent for testing for full test suite
- NO fake data/mocks/cheats
- Verify all issues resolved
- If fail: use Task agent for debugging, fix, repeat

### 5. Code Review
- Use Task agent for code review for all changes
- Verify fixes don't introduce regressions
- If critical issues: fix, retest

### 6. Project Management & Docs
- If approved: use Task agent for project management + Task agent for documentation in parallel
- Update plan files, docs, roadmap
- If rejected: fix and repeat

### 7. Final Report
- Summary of all fixes from parallel phases
- Verification status per issue
- Ask to commit (use Task agent for git operations if yes)

**Example:** Fix 1 (auth) + Fix 2 (payments) + Fix 3 (UI) → Launch 3 Task agents for fullstack development → Wait → Fix 4 (integration) sequential
