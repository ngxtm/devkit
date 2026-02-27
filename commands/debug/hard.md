---
description: Full Debug — Deep investigation for complex issues
version: "1.0"
category: debugging
execution-mode: execute
---

# /debug:hard — Deep Investigation

> **MISSION**: Thorough investigation for complex or intermittent issues.

<issue>$ARGUMENTS</issue>

---

## DELIVERABLE FILES

| Role | Output |
|------|--------|
| debugger | `./reports/debugs/DEBUG-{issue}.md` |

All files in `./reports/` → English only.

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: INFORMATION GATHERING

| Attribute | Value |
|-----------|-------|
| **Role** | `scouter` |
| **Goal** | Gather context and reproduction steps |
| **Exit** | Context gathered, reproduction documented |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Gather context and reproduction steps for the given issue. Exit when context is gathered and reproduction is documented.", description="scouter: Gather context and reproduction steps")

---

## Phase 2: HYPOTHESIS FORMATION

| Attribute | Value |
|-----------|-------|
| **Role** | `debugger` |
| **Goal** | Form and rank hypotheses |
| **Exit** | Hypotheses documented with evidence |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a debugger. Form and rank hypotheses for the issue. Exit when hypotheses are documented with evidence.", description="debugger: Form and rank hypotheses")

---

## Phase 3: ROOT CAUSE ANALYSIS

| Attribute | Value |
|-----------|-------|
| **Role** | `debugger` |
| **Goal** | Deep investigation |
| **Output** | `./reports/debugs/DEBUG-{issue}.md` |
| **Exit** | Root cause identified, failure chain documented |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a debugger. Perform deep investigation to identify root cause. Write findings to ./reports/debugs/DEBUG-{issue}.md. Exit when root cause is identified and failure chain is documented.", description="debugger: Deep root cause investigation")

---

## Phase 4: SOLUTION DESIGN

| Attribute | Value |
|-----------|-------|
| **Role** | `planner` |
| **Goal** | Design fix strategy |
| **Exit** | Fix approach defined with rollback plan |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a planner. Design a fix strategy based on the root cause analysis. Exit when fix approach is defined with rollback plan.", description="planner: Design fix strategy")

---

## COMPLETION

Present findings with:

1. **Root Cause** — Identified
2. **Fix** → `/fix:hard`
3. **Document** → `/docs:core`
