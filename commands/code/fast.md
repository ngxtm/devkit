---
description: Quick Implementation — Direct coding without planning phase
version: "1.0"
category: engineering
execution-mode: execute
---

# /code:fast — Rapid Implementation

> **MISSION**: Implement quickly with minimal overhead for well-defined tasks.

<task>$ARGUMENTS</task>

---

## CRITICAL: PHASE CONTINUITY RULES

```yaml
phase_continuity:
  rule: "If prior plan exists, MUST follow it"

  check_for_files:
    - "./reports/plans/PLAN-{task}.md"

  enforcement:
    - If plan file exists → READ and FOLLOW it
    - If no plan → Proceed with inline approach
```

All files in `./reports/` → English only.

---

## Execution

One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: CONTEXT SCAN

| Attribute | Value                                       |
| --------- | ------------------------------------------- |
| **Role**  | `scouter`                                   |
| **Goal**  | Find relevant code patterns and conventions |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Find relevant code patterns and conventions for the task. Exit when: relevant files identified, patterns understood, conventions noted.", description="scouter: Find relevant code patterns and conventions")

**Exit Criteria:**

- [ ] Relevant files identified
- [ ] Patterns understood
- [ ] Conventions noted

---

## Phase 2: IMPLEMENTATION

| Attribute | Value                                                      |
| --------- | ---------------------------------------------------------- |
| **Role**  | Route by domain: `frontend-engineer` \| `backend-engineer` |
| **Goal**  | Implement the feature/fix                                  |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a domain engineer (frontend or backend as appropriate). Implement the feature/fix following existing patterns. Exit when: code implemented, follows existing patterns, compiles without errors.", description="engineer: Implement the feature/fix")

**Exit Criteria:**

- [ ] Code implemented
- [ ] Follows existing patterns
- [ ] Compiles without errors

---

## Phase 3: QUICK VALIDATION

| Attribute | Value                              |
| --------- | ---------------------------------- |
| **Role**  | `tester`                           |
| **Goal**  | Basic validation of implementation |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tester. Perform basic validation of the implementation. Exit when: basic functionality verified, no obvious errors, ready for review.", description="tester: Basic validation of implementation")

**Exit Criteria:**

- [ ] Basic functionality verified
- [ ] No obvious errors
- [ ] Ready for review

---

## ESCALATION

| Condition                       | Route To            |
| ------------------------------- | ------------------- |
| Task more complex than expected | `/code:hard`        |
| Architectural decision needed   | `/plan:hard`        |
| Security concern                | `security-engineer` |

---

## COMPLETION

Present implementation with:

1. **Done** — Implementation complete
2. **Test** → `/test:fast`
3. **Review** → `/review:fast`
