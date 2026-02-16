---
title: "Rewrite /learn command to v2.0"
description: "Comprehensive rewrite of learn command with 10 improvements: adaptive difficulty, Socratic method, web search, better verify, resume support, codebase-aware"
status: completed
priority: P1
effort: 2h
branch: main
tags: [learn, command, rewrite, v2]
created: 2026-02-16
completed: 2026-02-16
---

# Plan: /learn v2.0 Rewrite

## Overview
Rewrite the `/learn` command from 477-line bloated v1.0 to a concise, modern v2.0 (<200 lines) with 10 improvements.

## Files Modified
| File | Action | Status |
|------|--------|--------|
| `.claude/commands/learn.md` | Rewritten (477→147 lines) | Done |
| `skills/learn/SKILL.md` | Synced with commands/learn.md | Done |

## Phases

| # | Phase | Status | File |
|---|-------|--------|------|
| 1 | Design new structure | Done | [phase-01](./phase-01-design-structure.md) |
| 2 | Implement & write new learn.md | Done | [phase-02](./phase-02-implement.md) |
| 3 | Sync & validate | Done | [phase-03](./phase-03-sync-validate.md) |

## Research
- [Codebase patterns](./research/researcher-01-codebase-patterns.md)
- [Improvement design](./research/researcher-02-improvement-design.md)

## Key Decisions
1. Integrate with existing `codingLevel` (0-5) instead of new 3-mode system
2. Reduce phases from 7 to 4: INIT → LEARN → BUILD → WRAP-UP
3. Target <200 lines (from 477) — achieved 147 lines
4. Save tutorials to `learn/` at project root
5. Keep single-file architecture (matching other commands)

## Results
- **Line reduction**: 477 → 147 (69% reduction)
- **All 10 improvements**: validated and passing
- **Files in sync**: commands/learn.md = skills/learn/SKILL.md
