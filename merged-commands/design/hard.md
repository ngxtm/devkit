---
description: ⚡⚡⚡ Full Design — Complete design process with research
version: "1.0"
category: design
execution-mode: execute
---

# /design:hard — Full Design Process

> **MISSION**: Execute complete design process with research, exploration, and iteration.

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
  researcher: "./reports/researchers/RESEARCH-{request}.md"
  scouter: "./reports/scouts/SCOUT-{request}.md"
  designer: "./reports/designs/DESIGN-{request}.md" # MANDATORY OUTPUT

enforcement:
  - Design phase MUST create design file
  - Design file is the deliverable for implementation phases
```

All files in `./reports/` → English only.

---

## ⛔ INCREMENTAL EXECUTION (MANDATORY)

One phase at a time, each phase independent: Phase 1 → then Phase 2 → … in one reply. No batching (load only what each phase needs). **Within each phase:** when doing a part, output it in format so user sees what’s happening (announce before doing).

---

## 🎭 Phase 1: REQUIREMENTS DISCOVERY

| Attribute | Value                       |
| --------- | --------------------------- |
| **Agent** | `brainstormer`              |
| **Goal**  | Clarify design requirements |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `brainstormer`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/brainstormer.md`
> EMBODY [brainstormer] — Requires logged system error justification.

**Exit Criteria:**

- [ ] Requirements clear
- [ ] User needs identified
- [ ] Constraints documented
- [ ] **METHODOLOGY CHECK**: Output aligns with `brainstormer` Thinking Protocol (Socratic questioning, assumption surfacing)

---

## 🎭 Phase 2: RESEARCH

| Attribute | Value                           |
| --------- | ------------------------------- |
| **Agent** | `researcher`                    |
| **Goal**  | Research design patterns and UX |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `researcher`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/researcher.md`
> EMBODY [researcher] — Requires logged system error justification.

**Exit Criteria:**

- [ ] Patterns researched
- [ ] Best practices identified
- [ ] **METHODOLOGY CHECK**: Output aligns with `researcher` Thinking Protocol (sources cited, evidence-based)

---

## 🎭 Phase 3: CODEBASE ANALYSIS

| Attribute | Value                      |
| --------- | -------------------------- |
| **Agent** | `scouter`                  |
| **Goal**  | Map existing design system |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `scouter`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/scouter.md`
> EMBODY [scouter] — Requires logged system error justification.

**Exit Criteria:**

- [ ] Design system documented
- [ ] Component inventory
- [ ] Integration points
- [ ] **METHODOLOGY CHECK**: Output aligns with `scouter` Thinking Protocol (file locations, patterns documented)

---

## 🎭 Phase 4: DESIGN CREATION

| Attribute | Value                  |
| --------- | ---------------------- |
| **Agent** | `designer`             |
| **Goal**  | Full design with specs |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `designer`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/designer.md`
> EMBODY [designer] — Requires logged system error justification.

**Exit Criteria:**

- [ ] Design complete
- [ ] All states covered
- [ ] Accessibility verified
- [ ] Specs documented
- [ ] **METHODOLOGY CHECK**: Output aligns with `designer` Thinking Protocol (user empathy, accessibility-first, visual hierarchy)

---

## 🎭 Phase 5: DESIGN REVIEW

| Attribute | Value                 |
| --------- | --------------------- |
| **Agent** | `reviewer`            |
| **Goal**  | Review design quality |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `reviewer`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/reviewer.md`
> EMBODY [reviewer] — Requires logged system error justification.

**Exit Criteria:**

- [ ] Design reviewed
- [ ] Standards met
- [ ] Approved
- [ ] **METHODOLOGY CHECK**: Output aligns with `reviewer` Thinking Protocol (specific feedback, priority matrix)

---

## COMPLETION

Present design with:

1. ✅ **Done** — Design approved
2. 💻 **Implement** → `/code:hard`
3. 🔄 **Iterate** — Further refinement
