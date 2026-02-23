---
title: "Rewrite /skill:sync for AI-driven upstream sync"
description: "Rewrite manual-sync.js and skill/sync.md to enable fully automated AI-driven upstream sync with 7 gap fixes"
status: pending
priority: P1
effort: 2h
branch: main
tags: [skill-sync, upstream, rewrite, automation]
created: 2026-02-23
---

# Plan: Rewrite /skill:sync

## Overview
Rewrite the upstream sync system so user can say "update upstream" and AI handles everything: clone, evaluate new+updated skills, evaluate external skills, evaluate rules, copy, rebuild, commit. Fix 7 identified gaps from current implementation.

## Gaps Being Fixed

| # | Gap | Solution |
|---|-----|----------|
| 1 | Only detects NEW skills, not UPDATED | Add content hash comparison in script |
| 2 | External-skills not in command | Add Step 3.5 for external-skills |
| 3 | `cp -r` fails on Windows | Use Node.js `fs.cpSync` in script |
| 4 | `upstream-version: latest` useless | Track real version from package.json |
| 5 | Branch + clean workdir forced | Add `--no-branch` flag to script |
| 6 | Rules ignored by command | Add rules evaluation step |
| 7 | No rollback on build failure | Git stash/reset mechanism |

## Files Modified

| File | Action | Status |
|------|--------|--------|
| `scripts/manual-sync.js` | Rewrite — JSON output, hash compare, --no-branch, cross-platform copy | Pending |
| `commands-claudekit/skill/sync.md` | Rewrite — full AI workflow with all categories | Pending |
| `skills/react-doctor/SKILL.md` | Update upstream-version field | Pending |

## Phases

| # | Phase | Status | File |
|---|-------|--------|------|
| 1 | Rewrite manual-sync.js | Pending | [phase-01](./phase-01-rewrite-script.md) |
| 2 | Rewrite skill/sync.md command | Pending | [phase-02-rewrite-command.md](./phase-02-rewrite-command.md) |

## Key Decisions
1. Script becomes a **pure utility** — clone + report (JSON). No branch, no workdir check by default.
2. Command becomes the **orchestrator** — AI reads JSON report, makes decisions, uses tools to copy/edit.
3. Hash comparison uses MD5 of SKILL.md content — fast, sufficient for change detection.
4. Cross-platform copy via `fs.cpSync(src, dest, { recursive: true })` (Node.js 16+).
5. Rollback via `git checkout -- .` if build fails after copy.
