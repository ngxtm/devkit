---
description: ⚡ Quick Design — Rapid component/UI design
version: "1.0"
category: design
execution-mode: execute
---

# /design:fast — Rapid Design

> **MISSION**: Quickly create design for simple components or UI elements.

<request>$ARGUMENTS</request>

---

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS PHASE 1)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):

1. ORCHESTRATION-LAWS.md
2. ADAPTIVE-EXECUTION.md
3. EXECUTION-PROTOCOL.md

**⛔ Do not run Phase 1 until all are loaded.** Follow **all** rules in those files; they override any conflicting instructions in this file.

---

## 🔀 TIERED EXECUTION PROTOCOL (MANDATORY)

> **Reference**: `{RULES_PATH}/ADAPTIVE-EXECUTION.md`

```yaml
tiered_execution:
  principle: "Sub-agent FIRST (Tier 1). EMBODY ONLY on system failure (Tier 2)."
  for_each_phase:
    TIER_1_MANDATORY: "IF tool exists → MUST use SUB_AGENT_DELEGATION"
    TIER_2_FALLBACK: "ONLY on system error—NOT complexity/preference/speed"
  anti_lazy_fallback:
    - ❌ NEVER use Tier 2 when Tier 1 tool is available
    - ✅ ALWAYS attempt Tier 1 first when tool exists
```

---

## ⚠️ CRITICAL: DELIVERABLE FILE RULES

```yaml
deliverable_files:
  designer: "./reports/designs/DESIGN-{request}.md" # For substantial designs

enforcement:
  - Simple component → Chat output OK
  - Page/feature design → MUST create design file
```

All files in `./reports/` → English only.

---

## ⛔ INCREMENTAL EXECUTION (MANDATORY)

One phase at a time, each phase independent: Phase 1 → then Phase 2 → … in one reply. No batching (load only what each phase needs). **Within each phase:** when doing a part, output it in format so user sees what’s happening (announce before doing).

---

## 🎭 Phase 1: CONTEXT ANALYSIS

| Attribute | Value                         |
| --------- | ----------------------------- |
| **Agent** | `scouter`                     |
| **Goal**  | Find existing design patterns |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `scouter`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/scouter.md`
> EMBODY [scouter] — Requires logged system error justification.

**Exit Criteria:**

- [ ] Existing patterns found
- [ ] Design system understood
- [ ] **METHODOLOGY CHECK**: Output aligns with `scouter` Thinking Protocol

---

## 🎭 Phase 2: DESIGN CREATION

| Attribute | Value                  |
| --------- | ---------------------- |
| **Agent** | `designer`             |
| **Goal**  | Create design solution |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `designer`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/designer.md`
> EMBODY [designer] — Requires logged system error justification.

**Exit Criteria:**

- [ ] Design created
- [ ] Accessibility considered
- [ ] Specs provided
- [ ] **METHODOLOGY CHECK**: Output aligns with `designer` Thinking Protocol

---

## ESCALATION

| Condition                  | Route To       |
| -------------------------- | -------------- |
| More complex than expected | `/design:hard` |
| Implementation needed      | `/code:fast`   |

---

## COMPLETION

Present design with:

1. ✅ **Done** — Design complete
2. 💻 **Implement** → `/code:fast`
3. 🔄 **Iterate** — Refine design
