---
description: ⚡ Quick Feature — Rapid feature implementation
version: "1.0"
category: engineering
execution-mode: execute
---

# /cook:fast — Rapid Feature Implementation

> **MISSION**: Quickly implement well-defined features with minimal ceremony.

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

| Tier       | When               | Action                       |
| ---------- | ------------------ | ---------------------------- |
| **TIER 1** | runSubagent EXISTS | Invoke sub-agent (MANDATORY) |
| **TIER 2** | Tool MISSING       | EMBODY agent file (FALLBACK) |

**❌ Anti-Lazy**: Never use TIER 2 when TIER 1 tool available.

---

## 📁 PRIOR PLAN CHECK

```
IF ./reports/plans/PLAN-{feature}.md exists:
  → READ and FOLLOW it
ELSE:
  → Create micro-plan inline
```

Any files in `./reports/` or `./documents/` → English only.

---

## ⛔ INCREMENTAL EXECUTION (MANDATORY)

One phase at a time, each phase independent: Phase 1 → then Phase 2 → … in one reply. No batching (load only what each phase needs). **Within each phase:** when doing a part, output it in format so user sees what’s happening (announce before doing).

---

## 🎭 Phase 1: CONTEXT SCAN

| Agent | `scouter`                                     |
| ----- | --------------------------------------------- |
| Goal  | Quick context gathering                       |
| Exit  | Patterns found, integration points identified |

---

## 🎭 Phase 2: MICRO-PLANNING

| Agent | `planner`                          |
| ----- | ---------------------------------- |
| Goal  | Quick implementation checklist     |
| Exit  | Steps identified, approach defined |

---

## 🎭 Phase 3: IMPLEMENTATION

| Agent        | Route by domain                                                               |
| ------------ | ----------------------------------------------------------------------------- |
| Route        | UI → `frontend-engineer`, API → `backend-engineer`, DB → `database-architect` |
| Prerequisite | READ `./reports/plans/PLAN-{feature}.md` if exists                            |
| Goal         | Implement feature                                                             |
| Exit         | Feature implemented, code compiles, basic testing done                        |

---

## ESCALATION

| Condition                  | Route To            |
| -------------------------- | ------------------- |
| More complex than expected | `/cook:hard`        |
| Design needed              | `designer`          |
| Security concern           | `security-engineer` |

---

## COMPLETION

Present feature with:

1. ✅ **Done** — Feature complete
2. 🧪 **Test** → `/test`
3. 📝 **Docs** → `/docs:core`
