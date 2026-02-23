# Phase 1: Create SKILL.md

> Parent: [plan.md](./plan.md)

## Overview
- Date: 2026-02-23
- Priority: P2
- Implementation: Pending
- Review: Pending

## Key Insights
- React Doctor's own skill (from install-skill.sh) is minimal — 15 lines, just usage command + "fix errors, re-run"
- Devkit skills like `react-expert` have structured sections: Role, When to Use, Core Workflow, Reference Guide, Constraints, Related Skills
- React Doctor has 60+ lint rules across 8 categories + dead code detection
- Supports framework detection (Next.js, Vite, Remix), React version, compiler setup
- Has config via `react-doctor.config.json` or `package.json` key
- Node.js API available: `import { diagnose } from "react-doctor/api"`

## Target File
`skills/react-doctor/SKILL.md`

## Frontmatter Schema
```yaml
---
name: react-doctor
description: Run react-doctor to scan React codebase for health issues. Diagnose security, performance, correctness, architecture problems with 0-100 score.
upstream: https://github.com/millionco/react-doctor
upstream-version: latest
triggers:
  - react-doctor
  - react health
  - react scan
  - react lint
  - code health
  - react audit
  - react score
role: tool
scope: diagnostics
output-format: analysis
---
```

Note: `upstream` and `upstream-version` are new frontmatter fields. Existing index scripts (`build-compact-index.js`, `generate-index.js`) only read `name`, `description` — extra fields are ignored safely.

## Content Structure

```markdown
# React Doctor

One-line: Scan React codebase for health issues, output 0-100 score with fixes.

## When to Use
- After making React changes (catch issues early)
- Code review / PR review
- Finishing a feature
- Periodic health check
- Setting up CI quality gates

## Quick Start
- npx command with flags
- Verbose mode for file details
- Diff mode for changed files only

## Rule Categories (8)
Brief list: state & effects, performance, architecture, bundle size, security, correctness, accessibility, framework-specific

## Configuration
- react-doctor.config.json format
- package.json "reactDoctor" key
- ignore rules, ignore files, toggle lint/deadCode

## CLI Flags
Table of all flags

## Workflow
1. Run scan → 2. Read score → 3. Fix errors first → 4. Re-run → 5. Score improved?

## Integration with Other Skills
- react-expert: for fixing identified issues
- code-review: include react-doctor scan in reviews
- test-master: dead code findings inform test gaps

## Scoring
- 75+ Great, 50-74 Needs work, <50 Critical
- Errors weigh more than warnings
```

## Implementation Steps

1. Create `skills/react-doctor/` directory
2. Write `SKILL.md` with frontmatter + content following structure above
3. Verify: `node scripts/build-compact-index.js` — react-doctor should appear in index
4. Verify: `node scripts/merge-commands.js` — react-doctor.md should be generated in merged-commands

## Success Criteria
- [ ] `skills/react-doctor/SKILL.md` exists with proper frontmatter
- [ ] `skills-compact.json` includes `react-doctor` entry after rebuild
- [ ] `merged-commands/react-doctor.md` generated after rebuild
- [ ] Content covers CLI usage, config, rule categories, workflow
- [ ] `upstream` field present for sync tracking
