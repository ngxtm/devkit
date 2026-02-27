---
description: Full Test — Comprehensive QA with quality gates
version: "1.0"
category: validation
execution-mode: execute
---

# /test:hard — Comprehensive Testing

> **MISSION**: Full QA workflow with quality gates and coverage reporting.

<scope>$ARGUMENTS</scope>

---

## PLAN CHECKPOINT VERIFICATION

```
IF ./reports/plans/PLAN-{scope}.md exists:
  1. READ plan completely
  2. EXTRACT all checkpoints
  3. FOR EACH checkpoint → Create test
  4. OUTPUT: "Checkpoint Coverage: X/Y"
```

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: TEST STRATEGY

| Attribute | Value |
|-----------|-------|
| **Role** | `tester` |
| **Goal** | Design test strategy |
| **Exit** | Strategy defined, test types identified |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tester. Design a test strategy. Exit when strategy is defined and test types are identified.", description="tester: Design test strategy")

---

## Phase 2: DEPENDENCY MAPPING

| Attribute | Value |
|-----------|-------|
| **Role** | `scouter` |
| **Goal** | Map test dependencies |
| **Exit** | Dependencies mapped, environment ready |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Map test dependencies. Exit when dependencies are mapped and environment is ready.", description="scouter: Map test dependencies")

---

## Phase 3: TEST EXECUTION

| Attribute | Value |
|-----------|-------|
| **Role** | `tester` |
| **Prerequisite** | READ PLAN file if exists |
| **Goal** | Run full test suite |
| **Exit** | All tests run, coverage measured, checkpoint mapping documented |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tester. Run the full test suite. Read the PLAN file if it exists. Exit when all tests are run, coverage is measured, and checkpoint mapping is documented.", description="tester: Run full test suite")

---

## Phase 4: FAILURE ANALYSIS (IF FAILURES)

| Attribute | Value |
|-----------|-------|
| **Role** | `debugger` |
| **Trigger** | If failures exist |
| **Goal** | Analyze failures |
| **Exit** | Root causes identified |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a debugger. Analyze test failures. Exit when root causes are identified.", description="debugger: Analyze test failures")

---

## Phase 5: QUALITY GATES

| Attribute | Value |
|-----------|-------|
| **Role** | `tester` |
| **Goal** | Verify quality gates |
| **Exit** | All gates pass, coverage adequate |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tester. Verify quality gates. Exit when all gates pass and coverage is adequate.", description="tester: Verify quality gates")

---

## COMPLETION

Present test report with:

1. **Pass** — All tests green
2. **Fix** → `/fix:fast`
3. **Review** → `/review`
