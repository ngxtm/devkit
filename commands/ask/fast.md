---
description: Quick Answer — Direct response from codebase context
version: "1.0"
category: knowledge
execution-mode: execute
---

# /ask:fast — Quick Question Answering

> **MISSION**: Provide fast, accurate answers using codebase context and existing knowledge.

<question>$ARGUMENTS</question>

---

## Execution

One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: CONTEXT GATHERING

| Attribute | Value                                |
| --------- | ------------------------------------ |
| **Role**  | `scouter`                            |
| **Goal**  | Find relevant code and documentation |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Find relevant code and documentation for the given question. Exit when: relevant files identified, context gathered, information sufficient.", description="scouter: Find relevant code and documentation")

**Exit Criteria:**

- [ ] Relevant files identified
- [ ] Context gathered
- [ ] Information sufficient (if not → escalate to `/ask:hard`)

---

## Phase 2: ANSWER FORMULATION

| Attribute | Value                            |
| --------- | -------------------------------- |
| **Role**  | `researcher`                     |
| **Goal**  | Formulate clear, accurate answer |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a researcher. Formulate a clear, accurate answer based on the gathered context. Exit when: answer formulated, sources cited, confidence level noted.", description="researcher: Formulate clear, accurate answer")

**Exit Criteria:**

- [ ] Answer formulated
- [ ] Sources cited
- [ ] Confidence level noted

---

## ESCALATION

| Condition                  | Route To     |
| -------------------------- | ------------ |
| Insufficient context       | `/ask:hard`  |
| Requires external research | `/ask:hard`  |
| Implementation needed      | `/code:fast` |

---

## COMPLETION

Present answer with:

1. **Answered** — Question resolved
2. **Deep Dive** → `/ask:hard` for more detail
3. **Implement** → Route to implementation workflow
