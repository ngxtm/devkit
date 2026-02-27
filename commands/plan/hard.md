---
description: Full Plan — Research-backed comprehensive planning
version: "1.0"
category: planning
execution-mode: execute
---

# /plan:hard — Comprehensive Planning

> **MISSION**: Create thorough implementation plan with research and architecture analysis.

<task>$ARGUMENTS</task>

---

## DELIVERABLE FILES

| Role       | Output                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| researcher | `./reports/researchers/RESEARCH-{task}.md`                                                                                                                               |
| scouter    | `./reports/scouts/SCOUT-{task}.md`                                                                                                                                       |
| planner    | **One** `./reports/plans/PLAN-{task}.md` **OR** multiple `./reports/plans/PLAN-{task}-phase1.md`, `PLAN-{task}-phase2.md`, … (see **Complexity & plan splitting** below) |

**Plans are source of truth for implementation.** All files in `./reports/` → English only.

---

## COMPLEXITY & PLAN SPLITTING (MANDATORY FOR PLANNER)

When the logical plan would have **> 3 phases** or **estimated effort > 3 days**, the planner **MUST** produce **multiple plan files** (one per executable phase or per milestone group), **not** one monolithic file.

| Condition                  | Planner output                                                   |
| -------------------------- | ---------------------------------------------------------------- |
| ≤ 3 phases, ≤ 3 days       | **One** `PLAN-{task}.md`                                         |
| > 3 phases **or** > 3 days | **Multiple** `PLAN-{task}-phase1.md`, `PLAN-{task}-phase2.md`, … |

**Multi-plan rules:**

- Naming: `PLAN-{task}-phase1.md`, `PLAN-{task}-phase2.md`, …
- Order: Execute in numeric order; phase N starts only after phase N−1 is complete.
- Each file: scope **only** that phase; Prerequisites state "Phase N−1 complete" (or prior deliverables); clear handoff to next file.
- Index (optional): planner may add `PLAN-{task}-INDEX.md` listing phases and file names for navigation.

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: RESEARCH

| Attribute | Value |
|-----------|-------|
| **Role** | `researcher` |
| **Goal** | Research best practices and patterns |
| **Output** | `./reports/researchers/RESEARCH-{task}.md` |
| **Exit** | Best practices identified, sources documented |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a researcher. Research best practices and patterns for the task. Write to ./reports/researchers/RESEARCH-{task}.md. Exit when best practices are identified and sources are documented.", description="researcher: Research best practices and patterns")

---

## Phase 2: CODEBASE ANALYSIS

| Attribute | Value |
|-----------|-------|
| **Role** | `scouter` |
| **Goal** | Full architecture mapping |
| **Output** | `./reports/scouts/SCOUT-{task}.md` |
| **Exit** | Architecture understood, dependencies mapped |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Perform full architecture mapping of the codebase. Write to ./reports/scouts/SCOUT-{task}.md. Exit when architecture is understood and dependencies are mapped.", description="scouter: Full architecture mapping")

---

## Phase 3: DESIGN (IF UI NEEDED)

| Attribute | Value |
|-----------|-------|
| **Role** | `designer` |
| **Trigger** | Task involves UI/UX |
| **Goal** | Design approach input |
| **Exit** | Design approach defined, accessibility considered |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a designer. Provide design approach input for the UI/UX aspects of the task. Exit when design approach is defined and accessibility is considered.", description="designer: Design approach input")

---

## Phase 4: PLAN CREATION

| Attribute    | Value |
| ------------ | ----- |
| **Role** | `planner` |
| **Prerequisite** | **READ** RESEARCH + SCOUT files (and DESIGN if Phase 3 ran) |
| **Goal** | Create detailed implementation plan as **one file** or **multiple phase files** (see **Complexity & plan splitting** above) |
| **Output** | One `./reports/plans/PLAN-{task}.md` **or** multiple `./reports/plans/PLAN-{task}-phase1.md`, `PLAN-{task}-phase2.md`, … |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a planner. Read the RESEARCH and SCOUT files first. Create a detailed implementation plan. If the task has > 3 phases or > 3 days effort, produce multiple plan files (one per phase). Each plan must reference prior phase findings. Exit when plan files are created with scope, prerequisites, tasks, exit criteria, risks, and rollback.", description="planner: Create detailed implementation plan")

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

1. **Plan Ready** — `./reports/plans/PLAN-{task}.md` (single) **or** `PLAN-{task}-phase1.md`, `PLAN-{task}-phase2.md`, … (multi-phase, execute in order)
2. **Implement** → `/cook:hard` (run phase-by-phase when multiple plan files exist)
