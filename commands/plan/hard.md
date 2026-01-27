---
description: ⚡⚡⚡ Full Plan — Research-backed comprehensive planning
version: "1.0"
category: planning
execution-mode: execute
---

# /plan:hard — Comprehensive Planning

> **MISSION**: Create thorough implementation plan with research and architecture analysis.

<task>$ARGUMENTS</task>

---

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS PHASE 1)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):

1. ORCHESTRATION-LAWS.md
2. ADAPTIVE-EXECUTION.md
3. EXECUTION-PROTOCOL.md

**⛔ Do not run Phase 1 until all are loaded.** Follow **all** rules in those files; they override any conflicting instructions in this file.

---

## 🔀 TIERED EXECUTION

| Tier       | When               | Action                       |
| ---------- | ------------------ | ---------------------------- |
| **TIER 1** | runSubagent EXISTS | Invoke sub-agent (MANDATORY) |
| **TIER 2** | Tool MISSING       | EMBODY agent file (FALLBACK) |

---

## 📁 DELIVERABLE FILES

| Agent      | Output                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| researcher | `./reports/researchers/RESEARCH-{task}.md`                                                                                                                               |
| scouter    | `./reports/scouts/SCOUT-{task}.md`                                                                                                                                       |
| planner    | **One** `./reports/plans/PLAN-{task}.md` **OR** multiple `./reports/plans/PLAN-{task}-phase1.md`, `PLAN-{task}-phase2.md`, … (see **Complexity & plan splitting** below) |

**Plans are source of truth for implementation.** All files in `./reports/` → English only.

---

## 📐 COMPLEXITY & PLAN SPLITTING (MANDATORY FOR PLANNER)

When the logical plan would have **> 3 phases** or **estimated effort > 3 days**, the planner **MUST** produce **multiple plan files** (one per executable phase or per milestone group), **not** one monolithic file.

| Condition                  | Planner output                                                   |
| -------------------------- | ---------------------------------------------------------------- |
| ≤ 3 phases, ≤ 3 days       | **One** `PLAN-{task}.md`                                         |
| > 3 phases **or** > 3 days | **Multiple** `PLAN-{task}-phase1.md`, `PLAN-{task}-phase2.md`, … |

**Multi-plan rules:**

- Naming: `PLAN-{task}-phase1.md`, `PLAN-{task}-phase2.md`, …
- Order: Execute in numeric order; phase N starts only after phase N−1 is complete.
- Each file: scope **only** that phase; Prerequisites state “Phase N−1 complete” (or prior deliverables); clear handoff to next file.
- Index (optional): planner may add `PLAN-{task}-INDEX.md` listing phases and file names for navigation.

---

## ⛔ INCREMENTAL EXECUTION (MANDATORY)

One phase at a time, each phase independent: Phase 1 → then Phase 2 → … in one reply. No batching (load only what each phase needs). **Within each phase:** when doing a part, output it in format so user sees what’s happening (announce before doing). Format: rules/EXECUTION-PROTOCOL.md § Phase output structure.

---

## 🎭 Phase 1: RESEARCH

| Agent  | `researcher`                                  |
| ------ | --------------------------------------------- |
| Goal   | Research best practices and patterns          |
| Output | `./reports/researchers/RESEARCH-{task}.md`    |
| Exit   | Best practices identified, sources documented |

---

## 🎭 Phase 2: CODEBASE ANALYSIS

| Agent  | `scouter`                                    |
| ------ | -------------------------------------------- |
| Goal   | Full architecture mapping                    |
| Output | `./reports/scouts/SCOUT-{task}.md`           |
| Exit   | Architecture understood, dependencies mapped |

---

## 🎭 Phase 3: DESIGN (IF UI NEEDED)

| Agent   | `designer`                                        |
| ------- | ------------------------------------------------- |
| Trigger | Task involves UI/UX                               |
| Goal    | Design approach input                             |
| Exit    | Design approach defined, accessibility considered |

---

## 🎭 Phase 4: PLAN CREATION

| Agent        | `planner`                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Prerequisite | **READ** RESEARCH + SCOUT files (and DESIGN if Phase 3 ran)                                                                 |
| Goal         | Create detailed implementation plan as **one file** or **multiple phase files** (see **Complexity & plan splitting** above) |
| Output       | One `./reports/plans/PLAN-{task}.md` **or** multiple `./reports/plans/PLAN-{task}-phase1.md`, `PLAN-{task}-phase2.md`, …    |

**Directive to planner:** If the task decomposes into **> 3 phases** or **> 3 days** effort, produce **multiple plan files** (one per phase/milestone), each executable in sequence. Otherwise produce a single `PLAN-{task}.md`.

**CONSTRAINT INHERITANCE:**

```
Plan(s) MUST reference prior phases:
- "Based on research finding R1..."
- "Following pattern from Scout..."
- "Per design decision D1..."
```

| Exit | One plan file **or** multiple phase plan files created; each has scope, prerequisites, tasks, exit criteria, risks, rollback; order and handoffs clear |

---

## COMPLETION

Present plan with:

1. ✅ **Plan Ready** — `./reports/plans/PLAN-{task}.md` (single) **or** `PLAN-{task}-phase1.md`, `PLAN-{task}-phase2.md`, … (multi-phase, execute in order)
2. 🍳 **Implement** → `/cook:hard` (run phase-by-phase when multiple plan files exist)
