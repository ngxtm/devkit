---
description: Quick Review — Fast PR/file review
version: "1.0"
category: validation
execution-mode: execute
---

# /review:fast — Quick Code Review

> **MISSION**: Fast review for PRs or specific files.

<scope>$ARGUMENTS</scope>

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: CODE REVIEW

| Attribute | Value |
|-----------|-------|
| **Role** | `reviewer` |
| **Goal** | Review code quality |
| **Exit** | Issues documented, recommendations provided |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a reviewer. Review code quality. Exit when issues are documented and recommendations are provided.", description="reviewer: Review code quality")

---

## ESCALATION

| If | Route To |
|----|----------|
| Architecture concerns | `/review:hard` |
| Security concerns | `security-engineer` |

---

## COMPLETION

Present review with:

1. **Approved** — Code ready
2. **Fix needed** → `/fix:fast`
