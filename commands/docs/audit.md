---
description: 🔒 Audit Docs — Generate 4 security and compliance documentation files
version: "1.0"
category: documentation
execution-mode: execute
---

# /docs:audit — Security & Compliance Documentation

> **MISSION**: Generate **ALL 4** audit documentation files.

<scope>$ARGUMENTS</scope>

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

## 📦 DELIVERABLES (REQUIRED — ALL 4 FILES)

> [!CAUTION]
> **MUST CREATE ALL 4 FILES**. Incomplete = FAILED execution.

> **⛔ DOCUMENT LANGUAGE — NON-NEGOTIABLE**  
> Every file under `./documents/` must be written in **English only**. Do not use the user's language (e.g. Vietnamese) for file content. (ORCHESTRATION-LAWS § LAW 6.)

| File                                         | Purpose                          |
| -------------------------------------------- | -------------------------------- |
| `./documents/audit/audit-security.md`        | Security assessment and findings |
| `./documents/audit/audit-compliance.md`      | Compliance status and gaps       |
| `./documents/audit/audit-dataflow.md`        | Data flow and privacy analysis   |
| `./documents/audit/audit-recommendations.md` | Remediation recommendations      |

---

## ⛔ INCREMENTAL EXECUTION (MANDATORY)

One phase at a time, each phase independent: Phase 1 → then Phase 2 → … in one reply. No batching (load only what each phase needs). **Within each phase:** when doing a part, output it in format so user sees what’s happening (announce before doing).

---

## 🎭 Phase 1: SECURITY ANALYSIS

| Attribute | Value                        |
| --------- | ---------------------------- |
| **Agent** | `security-engineer`          |
| **Goal**  | Complete security assessment |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `security-engineer`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/security-engineer.md`
> EMBODY [security-engineer] — Requires logged system error justification.

**Exit Criteria:**

- [ ] Vulnerabilities identified
- [ ] OWASP checklist complete
- [ ] Risk assessment done

---

## 🎭 Phase 2: CODEBASE SCAN

| Attribute | Value                              |
| --------- | ---------------------------------- |
| **Agent** | `scouter`                          |
| **Goal**  | Map data flows and sensitive areas |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `scouter`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/scouter.md`
> EMBODY [scouter] — Requires logged system error justification.

**Exit Criteria:**

- [ ] Data flows mapped
- [ ] Sensitive data identified
- [ ] Integration points cataloged

---

## 🎭 Phase 3: GENERATE ALL 4 DOCUMENTS

| Attribute | Value                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------- |
| **Agent** | `docs-manager`                                                                                 |
| **Goal**  | Create all 4 audit documentation files in **English only** (no user-language content in files) |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `docs-manager`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/docs-manager.md`
> EMBODY [docs-manager] — Requires logged system error justification.

**Exit Criteria:**

- [ ] `audit-security.md` created
- [ ] `audit-compliance.md` created
- [ ] `audit-dataflow.md` created
- [ ] `audit-recommendations.md` created

---

## ✅ VERIFICATION

Before completion, verify ALL 4 files exist:

```
./documents/audit/
├── ✅ audit-security.md
├── ✅ audit-compliance.md
├── ✅ audit-dataflow.md
└── ✅ audit-recommendations.md
```

---

## COMPLETION

Report status:

1. ✅ **Complete** — All 4 audit docs created
2. ❌ **Incomplete** — List missing files
3. 🔒 **Follow-up** — Address critical findings
