---
description: ⚡ Quick Test — Fast testing for specific scope
version: "1.0"
category: validation
execution-mode: execute
---

# /test:fast — Quick Testing

> **MISSION**: Run targeted tests for specific scope.

<scope>$ARGUMENTS</scope>

---

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS PHASE 1)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):
1. ORCHESTRATION-LAWS.md  
2. ADAPTIVE-EXECUTION.md  
3. EXECUTION-PROTOCOL.md  

**⛔ Do not run Phase 1 until all are loaded.** Follow **all** rules in those files; they override any conflicting instructions in this file.

---

## 🔀 TIERED EXECUTION

| Tier | When | Action |
|------|------|--------|
| **TIER 1** | runSubagent EXISTS | Invoke sub-agent (MANDATORY) |
| **TIER 2** | Tool MISSING | EMBODY agent file (FALLBACK) |

---

## ⛔ INCREMENTAL EXECUTION (MANDATORY)

One phase at a time, each phase independent: Phase 1 → then Phase 2 → … in one reply. No batching (load only what each phase needs). **Within each phase:** when doing a part, output it in format so user sees what’s happening (announce before doing).

---

## 🎭 Phase 1: TEST EXECUTION

| Agent | `tester` |
|-------|----------|
| Goal | Run focused tests |
| Exit | Tests run, results recorded |

---

## 🎭 Phase 2: QUICK ANALYSIS (IF FAILURES)

| Agent | `debugger` |
|-------|------------|
| Trigger | If failures exist |
| Goal | Quick failure analysis |
| Exit | Root causes identified |

---

## ESCALATION

| If | Route To |
|----|----------|
| More coverage needed | `/test:hard` |
| Complex failures | `/debug:hard` |

---

## COMPLETION

Present results with:

1. ✅ **Pass** — Tests green
2. 🔧 **Fix** → `/fix:fast`
