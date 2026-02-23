---
title: "Add react-doctor as devkit-native skill with upstream sync"
description: "Create devkit skill for react-doctor CLI tool, add to upstream sync config, create external-skill update workflow"
status: pending
priority: P2
effort: 1h
branch: main
tags: [skill, react-doctor, upstream-sync, external-skill]
created: 2026-02-23
---

# Plan: Devkit-Native React Doctor Skill

## Overview
Integrate [react-doctor](https://github.com/millionco/react-doctor) as a first-class devkit skill with upstream sync support. React Doctor scans React codebases for 60+ rules across security, performance, correctness, and architecture — outputs a 0-100 health score.

## Why Not Their Install Script?
Their `install-skill.sh` writes to `$HOME/.claude/skills/` (user-level) which devkit doesn't index. Creating a devkit-native skill means:
- Auto-indexed in `skills-compact.json`
- Auto-generated `/react-doctor` slash command via `merge-commands.js`
- Discoverable by auto-skill detection
- Synced via existing `npm run sync:upstream` workflow

## Files Modified

| File | Action | Status |
|------|--------|--------|
| `skills/react-doctor/SKILL.md` | Create | Pending |
| `scripts/manual-sync.js` | Add external-skills upstream | Pending |
| `skills/react-doctor/UPSTREAM.md` | Create sync workflow guide | Pending |

## Phases

| # | Phase | Status | File |
|---|-------|--------|------|
| 1 | Create SKILL.md | Pending | [phase-01](./phase-01-create-skill.md) |
| 2 | Add upstream sync config | Pending | [phase-02-upstream-sync.md](./phase-02-upstream-sync.md) |
| 3 | Create update workflow | Pending | [phase-03-update-workflow.md](./phase-03-update-workflow.md) |

## Key Decisions
1. Use `upstream` + `upstream-version` frontmatter fields for tracking source
2. Add new `external-skills` category in UPSTREAMS (single-skill repos, not collections)
3. Workflow guide lives in `skills/react-doctor/UPSTREAM.md` — co-located with the skill
4. No separate command file needed — `merge-commands.js` auto-generates from SKILL.md
5. Enhanced content beyond upstream's minimal 15-line skill — include rule categories, config, workflow
