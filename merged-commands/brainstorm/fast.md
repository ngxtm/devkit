---
description: Quick Ideation — Rapid idea generation
version: "1.0"
category: planning
execution-mode: execute
---

# /brainstorm:fast — Rapid Ideation

> **MISSION**: Generate ideas quickly through focused exploration without external research.

<topic>$ARGUMENTS</topic>

---

## CRITICAL: DELIVERABLE FILE RULES

```yaml
deliverable_files:
  brainstormer: "./reports/brainstorms/BRAINSTORM-{topic}.md" # MANDATORY for substantial synthesis

enforcement:
  - Clarification questions → Chat OK
  - Idea synthesis/analysis → MUST create file
```

All files in `./reports/` → English only.

---

## Execution

One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: TOPIC CLARIFICATION

| Attribute | Value                                |
| --------- | ------------------------------------ |
| **Role**  | `brainstormer`                       |
| **Goal**  | Clarify requirements and constraints |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a brainstormer. Clarify requirements and constraints for the given topic. Exit when: topic understood, constraints identified, success criteria defined.", description="brainstormer: Clarify requirements and constraints")

**Exit Criteria:**

- [ ] Topic understood
- [ ] Constraints identified
- [ ] Success criteria defined

---

## Phase 2: IDEA GENERATION

| Attribute | Value                  |
| --------- | ---------------------- |
| **Role**  | `brainstormer`         |
| **Goal**  | Generate diverse ideas |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a brainstormer. Generate diverse ideas for the topic. CREATE ./reports/brainstorms/BRAINSTORM-{topic}.md for synthesis. Exit when: brainstorm file created, multiple ideas generated, ideas categorized, trade-offs noted.", description="brainstormer: Generate diverse ideas")

**MANDATORY**: CREATE `./reports/brainstorms/BRAINSTORM-{topic}.md` for synthesis

**Exit Criteria:**

- [ ] Brainstorm file created at `./reports/brainstorms/BRAINSTORM-{topic}.md`
- [ ] Multiple ideas generated
- [ ] Ideas categorized
- [ ] Trade-offs noted

---

## Phase 3: CODEBASE CONTEXT (CONDITIONAL)

| Attribute   | Value                                |
| ----------- | ------------------------------------ |
| **Role**    | `scouter`                            |
| **Goal**    | Find relevant existing patterns      |
| **Trigger** | If ideas relate to existing codebase |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Find relevant existing patterns in the codebase that relate to the generated ideas. Exit when: existing patterns found, integration points identified.", description="scouter: Find relevant existing patterns")

**Exit Criteria:**

- [ ] Existing patterns found
- [ ] Integration points identified

---

## ESCALATION

| Condition          | Route To           |
| ------------------ | ------------------ |
| Research needed    | `/brainstorm:hard` |
| Ready to plan      | `/plan:fast`       |
| Ready to implement | `/code:fast`       |

---

## COMPLETION

Present ideas with:

1. **Ideas Ready** — Select preferred approach
2. **Research** → `/brainstorm:hard` for deeper analysis
3. **Plan** → `/plan:fast` to formalize
