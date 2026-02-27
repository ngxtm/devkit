---
description: Quick Test — Fast testing for specific scope
version: "1.0"
category: validation
execution-mode: execute
---

# /test:fast — Quick Testing

> **MISSION**: Run targeted tests for specific scope.

<scope>$ARGUMENTS</scope>

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: TEST EXECUTION

| Attribute | Value |
|-----------|-------|
| **Role** | `tester` |
| **Goal** | Run focused tests |
| **Exit** | Tests run, results recorded |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tester. Run focused tests for the given scope. Exit when tests are run and results are recorded.", description="tester: Run focused tests")

---

## Phase 2: QUICK ANALYSIS (IF FAILURES)

| Attribute | Value |
|-----------|-------|
| **Role** | `debugger` |
| **Trigger** | If failures exist |
| **Goal** | Quick failure analysis |
| **Exit** | Root causes identified |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a debugger. Perform quick failure analysis on test failures. Exit when root causes are identified.", description="debugger: Quick failure analysis")

---

## ESCALATION

| If | Route To |
|----|----------|
| More coverage needed | `/test:hard` |
| Complex failures | `/debug:hard` |

---

## COMPLETION

Present results with:

1. **Pass** — Tests green
2. **Fix** → `/fix:fast`
