---
description: Deep Ideation — Research-backed exploration
version: "1.0"
category: planning
execution-mode: execute
---

# /brainstorm:hard — Deep Ideation

> **MISSION**: Generate comprehensive ideas through research, analysis, and systematic exploration.

<topic>$ARGUMENTS</topic>

---

## CRITICAL: DELIVERABLE FILE RULES

```yaml
deliverable_files:
  brainstormer_clarify: # Chat output OK for questions
  researcher: "./reports/researchers/RESEARCH-{topic}.md"
  scouter: "./reports/scouts/SCOUT-{topic}.md"
  brainstormer_synthesis: "./reports/brainstorms/BRAINSTORM-{topic}.md" # MANDATORY OUTPUT

enforcement:
  - Research phase MUST create file
  - Final synthesis MUST create file
  - Synthesis file is the deliverable for downstream phases
```

All files in `./reports/` → English only.

---

## Execution

One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: REQUIREMENTS DISCOVERY

| Attribute | Value                           |
| --------- | ------------------------------- |
| **Role**  | `brainstormer`                  |
| **Goal**  | Deep requirements clarification |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a brainstormer. Perform deep requirements clarification using Socratic questioning and assumption surfacing. Exit when: requirements fully understood, stakeholders identified, constraints documented, success metrics defined.", description="brainstormer: Deep requirements clarification")

**Exit Criteria:**

- [ ] Requirements fully understood
- [ ] Stakeholders identified
- [ ] Constraints documented
- [ ] Success metrics defined

---

## Phase 2: RESEARCH

| Attribute | Value                                |
| --------- | ------------------------------------ |
| **Role**  | `researcher`                         |
| **Goal**  | Research best practices and patterns |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a researcher. Research best practices and patterns. CREATE ./reports/researchers/RESEARCH-{topic}.md with findings. Exit when: research file created, industry patterns researched, best practices documented, sources cited.", description="researcher: Research best practices and patterns")

**MANDATORY**: CREATE `./reports/researchers/RESEARCH-{topic}.md`

**Exit Criteria:**

- [ ] Research file created
- [ ] Industry patterns researched
- [ ] Best practices documented
- [ ] Sources cited

---

## Phase 3: CODEBASE ANALYSIS

| Attribute | Value                                  |
| --------- | -------------------------------------- |
| **Role**  | `scouter`                              |
| **Goal**  | Map existing architecture and patterns |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Map existing architecture and patterns in the codebase. Exit when: architecture understood, existing patterns documented, integration points identified.", description="scouter: Map existing architecture and patterns")

**Exit Criteria:**

- [ ] Architecture understood
- [ ] Existing patterns documented
- [ ] Integration points identified

---

## Phase 4: SOLUTION SYNTHESIS

| Attribute        | Value                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------- |
| **Role**         | `brainstormer`                                                                         |
| **Goal**         | Synthesize ideas with trade-off analysis                                               |
| **Prerequisite** | READ `./reports/researchers/RESEARCH-{topic}.md` + `./reports/scouts/SCOUT-{topic}.md` |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a brainstormer. READ all prior phase deliverables. Synthesize ideas with trade-off analysis. CREATE ./reports/brainstorms/BRAINSTORM-{topic}.md. Exit when: brainstorm file created, ideas synthesized incorporating research, trade-offs analyzed, recommendations provided.", description="brainstormer: Synthesize ideas with trade-off analysis")

**MANDATORY**:

- READ all prior phase deliverables
- CREATE `./reports/brainstorms/BRAINSTORM-{topic}.md`

**Exit Criteria:**

- [ ] Brainstorm file created at `./reports/brainstorms/BRAINSTORM-{topic}.md`
- [ ] Ideas synthesized incorporating research
- [ ] Trade-offs analyzed
- [ ] Recommendations provided

---

## COMPLETION

Present comprehensive analysis with:

1. **Analysis Complete** — Proceed with recommendation
2. **Plan** → `/plan:hard` for detailed planning
3. **Iterate** — Refine based on feedback
