---
description: Full Fix — Complete issue resolution with research
version: "1.0"
category: debugging
execution-mode: execute
---

# /fix:hard — Complete Issue Resolution

> **MISSION**: Full resolution workflow with research, planning, and validation.

<issue>$ARGUMENTS</issue>

---

## DELIVERABLE FILES

| Role | Output |
|------|--------|
| debugger | `./reports/debugs/DEBUG-{issue}.md` |
| researcher | `./reports/researchers/RESEARCH-{issue}.md` |

All files in `./reports/` → English only.

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: DEEP ANALYSIS

| Attribute | Value |
|-----------|-------|
| **Role** | `debugger` |
| **Goal** | Full root cause analysis |
| **Exit** | Root cause identified, impact assessed, failure chain documented |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a debugger. Perform full root cause analysis. Exit when root cause is identified, impact is assessed, and failure chain is documented.", description="debugger: Full root cause analysis")

---

## Phase 2: RESEARCH

| Attribute | Value |
|-----------|-------|
| **Role** | `researcher` |
| **Goal** | Research solution patterns |
| **Exit** | Solutions researched, best approach identified |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a researcher. Research solution patterns for the identified issue. Exit when solutions are researched and best approach is identified.", description="researcher: Research solution patterns")

---

## Phase 3: FIX PLANNING

| Attribute | Value |
|-----------|-------|
| **Role** | `planner` |
| **Goal** | Create fix strategy with rollback |
| **Exit** | Plan created, rollback included |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a planner. Create a fix strategy with rollback plan. Exit when plan is created and rollback is included.", description="planner: Create fix strategy")

---

## Phase 4: IMPLEMENTATION

| Attribute | Value |
|-----------|-------|
| **Role** | `tech-lead` → specialists |
| **Goal** | Execute fix plan |
| **Exit** | Fix implemented, changes documented |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tech-lead. Execute the fix plan, routing to specialist patterns as needed. Exit when fix is implemented and changes are documented.", description="tech-lead: Execute fix plan")

---

## Phase 5: VALIDATION

| Attribute | Value |
|-----------|-------|
| **Role** | `tester` |
| **Goal** | Comprehensive validation |
| **Exit** | Issue resolved, tests pass, no regression |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tester. Perform comprehensive validation. Exit when issue is resolved, tests pass, and no regression is found.", description="tester: Comprehensive validation")

---

## Phase 5.5: ROLLBACK VERIFICATION (IF CRITICAL)

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Trigger** | Fix affects production or is critical |
| **Goal** | Verify rollback plan |
| **Exit** | Rollback documented, tested, recovery time estimated |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Verify the rollback plan for the critical fix. Exit when rollback is documented, tested, and recovery time is estimated.", description="devops-engineer: Verify rollback plan")

---

## COMPLETION

Present fix report with:

1. **Fixed** — Issue resolved
2. **Test** → `/test`
3. **Docs** → `/docs:core`
