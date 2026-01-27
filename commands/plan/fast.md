---
description: ⚡ Quick Plan — Fast planning without deep research
version: "1.0"
category: planning
execution-mode: execute
---

# /plan:fast — Quick Planning

> **MISSION**: Create quick implementation plan for clear tasks.

<task>$ARGUMENTS</task>

---

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS PHASE 1)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):

1. ORCHESTRATION-LAWS.md
2. ADAPTIVE-EXECUTION.md
3. EXECUTION-PROTOCOL.md

**⛔ Do not run Phase 1 until all are loaded.** Follow **all** rules in those files; they override any conflicting instructions in this file.

---

## 🔀 TIERED EXECUTION

| Tier       | When               | Action                       |
| ---------- | ------------------ | ---------------------------- |
| **TIER 1** | runSubagent EXISTS | Invoke sub-agent (MANDATORY) |
| **TIER 2** | Tool MISSING       | EMBODY agent file (FALLBACK) |

**Deliverables:** All files in `./reports/` → English only.

---

## ⛔ INCREMENTAL EXECUTION (MANDATORY)

One phase at a time, each phase independent: Phase 1 → then Phase 2 → … in one reply. No batching (load only what each phase needs). **Within each phase:** when doing a part, output it in format so user sees what’s happening (announce before doing). Format: rules/EXECUTION-PROTOCOL.md § Phase output structure.

---

## 🎭 Phase 1: CONTEXT SCAN

| Agent | `scouter`                                              |
| ----- | ------------------------------------------------------ |
| Goal  | Quick context gathering                                |
| Exit  | Relevant patterns found, integration points identified |

---

## 🎭 Phase 2: PLAN CREATION

| Agent  | `planner`                          |
| ------ | ---------------------------------- |
| Goal   | Create focused implementation plan |
| Output | `./reports/plans/PLAN-{task}.md`   |
| Exit   | Steps defined, approach clear      |

---

## ESCALATION

| If                   | Route To     |
| -------------------- | ------------ |
| Complex architecture | `/plan:hard` |
| Research needed      | `/plan:hard` |

---

## COMPLETION

Present plan with:

1. ✅ **Plan Ready** — `./reports/plans/PLAN-{task}.md`
2. 🍳 **Implement** → `/cook:fast`
