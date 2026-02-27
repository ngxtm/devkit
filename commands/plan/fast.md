---
description: Quick Plan — Fast planning without deep research
version: "1.0"
category: planning
execution-mode: execute
---

# /plan:fast — Quick Planning

> **MISSION**: Create quick implementation plan for clear tasks.

<task>$ARGUMENTS</task>

---

**Deliverables:** All files in `./reports/` → English only.

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: CONTEXT SCAN

| Attribute | Value |
|-----------|-------|
| **Role** | `scouter` |
| **Goal** | Quick context gathering |
| **Exit** | Relevant patterns found, integration points identified |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Perform quick context gathering. Exit when relevant patterns are found and integration points are identified.", description="scouter: Quick context gathering")

---

## Phase 2: PLAN CREATION

| Attribute | Value |
|-----------|-------|
| **Role** | `planner` |
| **Goal** | Create focused implementation plan |
| **Output** | `./reports/plans/PLAN-{task}.md` |
| **Exit** | Steps defined, approach clear |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a planner. Create a focused implementation plan. Write to ./reports/plans/PLAN-{task}.md. Exit when steps are defined and approach is clear.", description="planner: Create focused implementation plan")

---

## ESCALATION

| If                   | Route To     |
| -------------------- | ------------ |
| Complex architecture | `/plan:hard` |
| Research needed      | `/plan:hard` |

---

## COMPLETION

Present plan with:

1. **Plan Ready** — `./reports/plans/PLAN-{task}.md`
2. **Implement** → `/cook:fast`
