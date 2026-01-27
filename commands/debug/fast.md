---
description: ⚡ Quick Debug — Fast diagnosis for simple bugs
version: "1.0"
category: debugging
execution-mode: execute
---

# /debug:fast — Quick Diagnosis

> **MISSION**: Fast diagnosis for clear, reproducible issues.

<issue>$ARGUMENTS</issue>

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

## 🎭 Phase 1: QUICK DIAGNOSIS

| Agent | `debugger` |
|-------|------------|
| Goal | Fast root cause identification |
| Exit | Root cause identified |

---

## ESCALATION

| If | Route To |
|----|----------|
| Complex/intermittent | `/debug:hard` |
| Multiple causes | `/debug:hard` |

---

## COMPLETION

Present findings with:

1. ✅ **Root Cause** — Identified
2. 🔧 **Fix** → `/fix:fast`
