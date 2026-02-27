---
description: ⚡⚡⚡ Full Feature — Complete feature development lifecycle
version: "1.0"
category: engineering
execution-mode: execute
---

# /cook:hard — Complete Feature Development

> **MISSION**: Full feature development with research, design, planning, implementation, validation.

<feature>$ARGUMENTS</feature>

---

## 📁 DELIVERABLE FILES

| Role         | Output                                          |
| ------------ | ----------------------------------------------- |
| brainstormer | `./reports/brainstorms/BRAINSTORM-{feature}.md` |
| researcher   | `./reports/researchers/RESEARCH-{feature}.md`   |
| scouter      | `./reports/scouts/SCOUT-{feature}.md`           |
| designer     | `./reports/designs/DESIGN-{feature}.md`         |
| planner      | `./reports/plans/PLAN-{feature}.md`             |

All files in `./reports/` → English only.

---

## 🔗 PHASE DEPENDENCIES

| Phase              | Requires               | Blocking    |
| ------------------ | ---------------------- | ----------- |
| P1: Brainstorm     | User request           | No          |
| P2: Research       | User request           | No          |
| P3: Scout          | User request           | No          |
| P3.5: DB Design    | Data requirements      | Conditional |
| P4: Design         | Scout findings         | Conditional |
| P5: Planning       | RESEARCH + SCOUT files | **YES**     |
| P6: Implementation | **PLAN file**          | **YES**     |
| P7: Testing        | PLAN + Code            | **YES**     |
| P8: Review         | PLAN + Code + Tests    | **YES**     |

**⛔ Blocking**: If input missing → STOP → Create it first → Resume

---

## 🎭 Phase 1: REQUIREMENTS CLARIFICATION

| Role  | `brainstormer`                                                       |
| ----- | -------------------------------------------------------------------- |
| Goal  | Full requirements discovery                                          |
| Exit  | Requirements clear, constraints identified, success criteria defined |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a brainstormer. Full requirements discovery. [See exit criteria above]", description="brainstormer")

---

## 🎭 Phase 2: RESEARCH

| Role  | `researcher`                                                               |
| ----- | -------------------------------------------------------------------------- |
| Goal  | Research best practices and patterns                                       |
| Exit  | Patterns researched, best practices identified, recommendations documented |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a researcher. Research best practices and patterns. [See exit criteria above]", description="researcher")

---

## 🎭 Phase 3: CODEBASE ANALYSIS

| Role  | `scouter`                                                               |
| ----- | ----------------------------------------------------------------------- |
| Goal  | Map architecture and integration points                                 |
| Exit  | Architecture understood, integration points mapped, patterns documented |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Map architecture and integration points. [See exit criteria above]", description="scouter")

---

## 🎭 Phase 3.5: DATABASE DESIGN (IF DATA CHANGES)

| Role    | `database-architect`                                        |
| ------- | ----------------------------------------------------------- |
| Trigger | Feature involves database changes/migrations                |
| Goal    | Schema design and data modeling                             |
| Exit    | Schema designed, migrations planned, query patterns defined |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a database-architect. Schema design and data modeling. [See exit criteria above]", description="database-architect")

---

## 🎭 Phase 4: DESIGN (IF UI NEEDED)

| Role    | `designer`                                            |
| ------- | ----------------------------------------------------- |
| Trigger | Feature has UI components                             |
| Goal    | UI/UX design                                          |
| Exit    | Design created, accessibility considered, specs ready |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a designer. UI/UX design. [See exit criteria above]", description="designer")

---

## 🎭 Phase 5: PLANNING

| Role         | `planner`                                           |
| ------------ | --------------------------------------------------- |
| Prerequisite | **READ** RESEARCH + SCOUT + DESIGN files            |
| Goal         | Create detailed implementation plan                 |
| Output       | `./reports/plans/PLAN-{feature}.md`                 |
| Exit         | Plan file created, phases defined, risks identified |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a planner. READ RESEARCH + SCOUT + DESIGN files. Create detailed implementation plan. [See exit criteria above]", description="planner")

---

## 🎭 Phase 6: IMPLEMENTATION

| Role         | `tech-lead` → routes to specialists                     |
| ------------ | ------------------------------------------------------- |
| Prerequisite | **READ and FOLLOW** `./reports/plans/PLAN-{feature}.md` |
| Goal         | Execute implementation plan                             |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tech-lead. READ and FOLLOW the PLAN file. Execute implementation plan. [See exit criteria below]", description="tech-lead")

**STRICT ADHERENCE:**

```
1. READ plan FIRST
2. FOR EACH step:
   - Implement EXACTLY as specified
   - Mark step complete: [ ] → [x]
3. IF step seems wrong:
   - STOP → Document → Request Re-Planning
   - DO NOT implement your own interpretation
```

| Exit | All plan phases complete, no unauthorized deviations |

---

## 🎭 Phase 7: TESTING

| Role         | `tester`                     |
| ------------ | ---------------------------- |
| Prerequisite | **READ** PLAN + Code changes |
| Goal         | Comprehensive testing        |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tester. READ PLAN + Code changes. Comprehensive testing with plan checkpoint verification. [See exit criteria below]", description="tester")

**PLAN CHECKPOINT VERIFICATION:**

```
FOR EACH checkpoint in PLAN:
  - Write test that verifies criteria
  - Document: "Checkpoint X → Test Y"
```

| Exit | All tests pass, each plan checkpoint has test |

---

## 🎭 Phase 8: REVIEW

| Role         | `reviewer`                       |
| ------------ | -------------------------------- |
| Prerequisite | **READ** PLAN + Code + Tests     |
| Goal         | Quality review + Plan compliance |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a reviewer. READ PLAN + Code + Tests. Quality review and plan compliance check. [See exit criteria below]", description="reviewer")

**REVIEW CHECKLIST:**

- Does code implement plan specification?
- Any unauthorized deviations?
- All plan phases reflected in code?

| Exit | Code matches plan intent, standards met, approved |

---

## COMPLETION

Present feature report with:

1. ✅ **Done** — Feature complete
2. 🚀 **Deploy** → `/deploy:preview`
3. 📝 **Docs** → `/docs:core`
