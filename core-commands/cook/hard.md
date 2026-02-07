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

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS PHASE 1)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):

1. ORCHESTRATION-LAWS.md
2. ADAPTIVE-EXECUTION.md
3. EXECUTION-PROTOCOL.md

**⛔ Do not run Phase 1 until all are loaded.** Follow **all** rules in those files; they override any conflicting instructions in this file.

---

## 🔀 TIERED EXECUTION

> Reference: `{RULES_PATH}/ADAPTIVE-EXECUTION.md`

| Tier       | When                          | Action                       |
| ---------- | ----------------------------- | ---------------------------- |
| **TIER 1** | runSubagent/Agent Tool EXISTS | Invoke sub-agent (MANDATORY) |
| **TIER 2** | Tool MISSING or SYSTEM error  | EMBODY agent file (FALLBACK) |

**❌ Anti-Lazy**: Never use TIER 2 when TIER 1 tool available.

---

## 📁 DELIVERABLE FILES

| Agent        | Output                                          |
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

## ⛔ INCREMENTAL EXECUTION (MANDATORY)

One phase at a time, each phase independent: Phase 1 → then Phase 2 → … in one reply. No batching (load only what each phase needs). **Within each phase:** when doing a part, output it in format so user sees what’s happening (announce before doing). Format: rules/EXECUTION-PROTOCOL.md § Phase output structure.

---

## 🎭 Phase 1: REQUIREMENTS CLARIFICATION

| Agent | `brainstormer`                                                       |
| ----- | -------------------------------------------------------------------- |
| Goal  | Full requirements discovery                                          |
| Exit  | Requirements clear, constraints identified, success criteria defined |

---

## 🎭 Phase 2: RESEARCH

| Agent | `researcher`                                                               |
| ----- | -------------------------------------------------------------------------- |
| Goal  | Research best practices and patterns                                       |
| Exit  | Patterns researched, best practices identified, recommendations documented |

---

## 🎭 Phase 3: CODEBASE ANALYSIS

| Agent | `scouter`                                                               |
| ----- | ----------------------------------------------------------------------- |
| Goal  | Map architecture and integration points                                 |
| Exit  | Architecture understood, integration points mapped, patterns documented |

---

## 🎭 Phase 3.5: DATABASE DESIGN (IF DATA CHANGES)

| Agent   | `database-architect`                                        |
| ------- | ----------------------------------------------------------- |
| Trigger | Feature involves database changes/migrations                |
| Goal    | Schema design and data modeling                             |
| Exit    | Schema designed, migrations planned, query patterns defined |

---

## 🎭 Phase 4: DESIGN (IF UI NEEDED)

| Agent   | `designer`                                            |
| ------- | ----------------------------------------------------- |
| Trigger | Feature has UI components                             |
| Goal    | UI/UX design                                          |
| Exit    | Design created, accessibility considered, specs ready |

---

## 🎭 Phase 5: PLANNING

| Agent        | `planner`                                           |
| ------------ | --------------------------------------------------- |
| Prerequisite | **READ** RESEARCH + SCOUT + DESIGN files            |
| Goal         | Create detailed implementation plan                 |
| Output       | `./reports/plans/PLAN-{feature}.md`                 |
| Exit         | Plan file created, phases defined, risks identified |

---

## 🎭 Phase 6: IMPLEMENTATION

| Agent        | `tech-lead` → routes to specialists                     |
| ------------ | ------------------------------------------------------- |
| Prerequisite | **READ and FOLLOW** `./reports/plans/PLAN-{feature}.md` |
| Goal         | Execute implementation plan                             |

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

| Agent        | `tester`                     |
| ------------ | ---------------------------- |
| Prerequisite | **READ** PLAN + Code changes |
| Goal         | Comprehensive testing        |

**PLAN CHECKPOINT VERIFICATION:**

```
FOR EACH checkpoint in PLAN:
  - Write test that verifies criteria
  - Document: "Checkpoint X → Test Y"
```

| Exit | All tests pass, each plan checkpoint has test |

---

## 🎭 Phase 8: REVIEW

| Agent        | `reviewer`                       |
| ------------ | -------------------------------- |
| Prerequisite | **READ** PLAN + Code + Tests     |
| Goal         | Quality review + Plan compliance |

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
