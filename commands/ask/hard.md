---
description: Research Answer — External research with comprehensive analysis
version: "1.0"
category: knowledge
execution-mode: execute
---

# /ask:hard — Research-Backed Answering

> **MISSION**: Provide comprehensive, research-backed answers through multi-source analysis.

<question>$ARGUMENTS</question>

---

## Execution

One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: QUESTION ANALYSIS

| Attribute | Value                                       |
| --------- | ------------------------------------------- |
| **Role**  | `brainstormer`                              |
| **Goal**  | Decompose question into research components |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a brainstormer. Decompose the question into research components. Exit when: question scope defined, research areas identified, success criteria established.", description="brainstormer: Decompose question into research components")

**Exit Criteria:**

- [ ] Question scope defined
- [ ] Research areas identified
- [ ] Success criteria established

---

## Phase 2: CODEBASE ANALYSIS

| Attribute | Value                         |
| --------- | ----------------------------- |
| **Role**  | `scouter`                     |
| **Goal**  | Map relevant codebase context |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Map relevant codebase context for the question. Exit when: relevant code found, patterns documented, internal context complete.", description="scouter: Map relevant codebase context")

**Exit Criteria:**

- [ ] Relevant code found
- [ ] Patterns documented
- [ ] Internal context complete

---

## Phase 3: EXTERNAL RESEARCH

| Attribute | Value                                        |
| --------- | -------------------------------------------- |
| **Role**  | `researcher`                                 |
| **Goal**  | Research external sources and best practices |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a researcher. Research external sources and best practices relevant to the question. Exit when: external sources consulted, best practices identified, sources documented.", description="researcher: Research external sources and best practices")

**Exit Criteria:**

- [ ] External sources consulted
- [ ] Best practices identified
- [ ] Sources documented

---

## Phase 4: SYNTHESIS

| Attribute | Value                           |
| --------- | ------------------------------- |
| **Role**  | `researcher`                    |
| **Goal**  | Synthesize comprehensive answer |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a researcher. Synthesize all gathered information into a comprehensive answer. Exit when: all sources synthesized, answer comprehensive, actionable recommendations included.", description="researcher: Synthesize comprehensive answer")

**Exit Criteria:**

- [ ] All sources synthesized
- [ ] Answer comprehensive
- [ ] Actionable recommendations included

---

## COMPLETION

Present research report with:

1. **Answered** — Question resolved
2. **Plan** → `/plan:hard` if implementation needed
3. **Implement** → `/code:hard` for complex implementation
