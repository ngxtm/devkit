---
description: ⚡⚡⚡⚡⚡ Bootstrap project with parallel execution
argument-hint: [user-requirements]
---

**Ultrathink parallel** to bootstrap: <user-requirements>$ARGUMENTS</user-requirements>

**IMPORTANT:** Activate needed skills. Ensure token efficiency. Sacrifice grammar for concision.
**YAGNI, KISS, DRY** principles apply.

## Workflow

### 1. Git Init
- Check if Git initialized, if not: use Task agent for git operations (main branch)

### 2. Research
- Use max 2 Task agents for research in parallel
- Explore requirements, validation, challenges, solutions
- Keep reports ≤150 lines

### 3. Tech Stack
- Use Task agent for planning + multiple Task agents for research in parallel for best fit tech stack
- Write to `./docs` directory (≤150 lines)

### 4. Wireframe & Design
- Use Task agent for UI/UX design + Task agents for research in parallel
- Research: style, trends, fonts, colors, spacing, positions
- Describe assets for `ai-multimodal` generation
- Create design guidelines at `./docs/design-guidelines.md`
- Generate wireframes HTML at `./docs/wireframe`
- Generate logo with `ai-multimodal` if needed
- Screenshot with `chrome-devtools` → save to `./docs/wireframes/`
- Ask user to approve (repeat if rejected)

### 5. Parallel Planning & Implementation
- Trigger `/plan:parallel <detailed-instruction>` for parallel-executable plan
- Read `plan.md` for dependency graph and execution strategy
- Launch multiple Task agents for fullstack development in PARALLEL for concurrent phases
  - Pass: phase file path, environment info
- Use Task agent for UI/UX design for frontend (generate/analyze assets with `ai-multimodal`, edit with `imagemagick`)
- Run type checking after implementation

### 6. Testing
- Write real tests (NO fake data/mocks)
- Use Task agent for testing
- If fail: Task agent for debugging → fix → repeat

### 7. Code Review
- Use Task agent for code review
- If critical: fix → retest → repeat

### 8. Documentation
- Use Task agent for documentation to create/update:
  - `./docs/README.md` (≤300 lines)
  - `./docs/project-overview-pdr.md`
  - `./docs/code-standards.md`
  - `./docs/system-architecture.md`
- Use Task agent for project management for `./docs/project-roadmap.md`

### 9. Onboarding
- Guide user to get started (1 question at a time)
- Help configure (API keys, env vars, etc.)

### 10. Final Report
- Summary, guide, next steps
- Ask to commit (use Task agent for git operations if yes)
