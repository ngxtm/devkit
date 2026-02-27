---
description: Quick Debug — Fast diagnosis for simple bugs
version: "1.0"
category: debugging
execution-mode: execute
---

# /debug:fast — Quick Diagnosis

> **MISSION**: Fast diagnosis for clear, reproducible issues.

<issue>$ARGUMENTS</issue>

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: QUICK DIAGNOSIS

| Attribute | Value |
|-----------|-------|
| **Role** | `debugger` |
| **Goal** | Fast root cause identification |
| **Exit** | Root cause identified |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a debugger. Perform fast root cause identification for the given issue. Exit when root cause is identified.", description="debugger: Fast root cause identification")

---

## ESCALATION

| If | Route To |
|----|----------|
| Complex/intermittent | `/debug:hard` |
| Multiple causes | `/debug:hard` |

---

## COMPLETION

Present findings with:

1. **Root Cause** — Identified
2. **Fix** → `/fix:fast`
