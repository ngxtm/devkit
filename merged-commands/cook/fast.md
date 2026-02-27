---
description: Quick Feature — Rapid feature implementation
version: "1.0"
category: engineering
execution-mode: execute
---

# /cook:fast — Rapid Feature Implementation

> **MISSION**: Quickly implement well-defined features with minimal ceremony.

<feature>$ARGUMENTS</feature>

---

## PRIOR PLAN CHECK

```
IF ./reports/plans/PLAN-{feature}.md exists:
  → READ and FOLLOW it
ELSE:
  → Create micro-plan inline
```

Any files in `./reports/` or `./documents/` → English only.

---

## Execution

One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: CONTEXT SCAN

| Attribute | Value                                         |
| --------- | --------------------------------------------- |
| **Role**  | `scouter`                                     |
| **Goal**  | Quick context gathering                       |
| **Exit**  | Patterns found, integration points identified |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Perform quick context gathering for the feature. Exit when: patterns found, integration points identified.", description="scouter: Quick context gathering")

---

## Phase 2: MICRO-PLANNING

| Attribute | Value                              |
| --------- | ---------------------------------- |
| **Role**  | `planner`                          |
| **Goal**  | Quick implementation checklist     |
| **Exit**  | Steps identified, approach defined |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a planner. Create a quick implementation checklist for the feature. Exit when: steps identified, approach defined.", description="planner: Quick implementation checklist")

---

## Phase 3: IMPLEMENTATION

| Attribute        | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Role**         | Route by domain: UI → `frontend-engineer`, API → `backend-engineer`, DB → `database-architect` |
| **Prerequisite** | READ `./reports/plans/PLAN-{feature}.md` if exists                    |
| **Goal**         | Implement feature                                                     |
| **Exit**         | Feature implemented, code compiles, basic testing done                |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a domain engineer (frontend, backend, or database as appropriate). Implement the feature following existing patterns. READ plan file if exists. Exit when: feature implemented, code compiles, basic testing done.", description="engineer: Implement feature")

---

## ESCALATION

| Condition                  | Route To            |
| -------------------------- | ------------------- |
| More complex than expected | `/cook:hard`        |
| Design needed              | `designer`          |
| Security concern           | `security-engineer` |

---

## COMPLETION

Present feature with:

1. **Done** — Feature complete
2. **Test** → `/test`
3. **Docs** → `/docs:core`
