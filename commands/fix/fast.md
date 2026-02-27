---
description: Quick Fix — Rapid issue resolution
version: "1.0"
category: debugging
execution-mode: execute
---

# /fix:fast — Rapid Issue Fix

> **MISSION**: Quickly diagnose and fix simple issues with minimal overhead.

<issue>$ARGUMENTS</issue>

---

## ESCALATION

| If | Route To |
|----|----------|
| Complex issue | `/fix:hard` |
| Research needed | `/fix:hard` |

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: DIAGNOSIS

| Attribute | Value |
|-----------|-------|
| **Role** | `debugger` |
| **Goal** | Identify root cause |
| **Exit** | Root cause identified, complexity assessed |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a debugger. Identify the root cause of the issue and assess complexity. Exit when root cause is identified and complexity is assessed.", description="debugger: Identify root cause")

---

## Phase 2: FIX IMPLEMENTATION

| Attribute | Value |
|-----------|-------|
| **Role** | Route by domain: UI → `frontend-engineer`, API → `backend-engineer` |
| **Goal** | Implement fix |
| **Exit** | Fix implemented, minimal changes, code compiles |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are an engineer. Implement the fix based on the diagnosis. Route by domain: UI issues use frontend patterns, API issues use backend patterns. Exit when fix is implemented with minimal changes and code compiles.", description="engineer: Implement fix")

---

## Phase 3: VALIDATION

| Attribute | Value |
|-----------|-------|
| **Role** | `tester` |
| **Goal** | Verify fix |
| **Exit** | Issue resolved, no regression |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tester. Verify the fix resolves the issue with no regression. Exit when issue is confirmed resolved and no regression is found.", description="tester: Verify fix")

---

## COMPLETION

Present fix with:

1. **Fixed** — Issue resolved
2. **Test more** → `/test`
