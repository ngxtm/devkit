---
description: 💻 Core Docs — Generate 5 essential technical documentation files
version: "1.0"
category: documentation
execution-mode: execute
---

# /docs:core — Core Technical Documentation

> **MISSION**: Analyze current project and generate **ALL 5** essential documentation files.

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

## 📦 DELIVERABLES (REQUIRED — ALL 5 FILES)

> [!CAUTION]
> **MUST CREATE ALL 5 FILES**. Incomplete = FAILED execution.

> **⛔ DOCUMENT LANGUAGE — NON-NEGOTIABLE**  
> Every file under `./documents/` must be written in **English only**. Headings, body text, tables, and lists must be in English. Do not use the user's language (e.g. Vietnamese) for file content. Chat/UI may follow user language; document files do not. (ORCHESTRATION-LAWS § LAW 6.)

| File                                    | Purpose                                                       |
| --------------------------------------- | ------------------------------------------------------------- |
| `./documents/knowledge-overview.md`     | Project introduction, goals, tech stack, getting started      |
| `./documents/knowledge-architecture.md` | System design, components, data flow, design patterns         |
| `./documents/knowledge-domain.md`       | Data models, database schema, API contracts, domain entities  |
| `./documents/knowledge-source-base.md`  | Directory structure, file purposes, entry points, key modules |
| `./documents/knowledge-standards.md`    | Code style, naming conventions, commit format, guidelines     |

### 📋 File Purpose Details

| File | AI Uses It For | Key Sections |
|------|----------------|--------------|
| **overview** | Understanding WHAT the project does and WHY | Purpose, Goals, Tech Stack, Features, Getting Started |
| **architecture** | Understanding HOW components interact | Layers, Components, Data Flow, Design Patterns, Dependencies |
| **domain** | Understanding WHAT DATA the project handles | Entities, Relationships, Database Schema, API Endpoints, Business Rules |
| **source-base** | Understanding WHERE code lives | Directory Tree, Entry Points, Key Files, Module Breakdown |
| **standards** | Understanding HOW to write code correctly | Naming, Style, Commit Format, PR Guidelines, Testing Standards |

---

## ⛔ INCREMENTAL EXECUTION (MANDATORY)

One phase at a time, each phase independent: Phase 1 → then Phase 2 → … in one reply. No batching (load only what each phase needs). **Within each phase:** when doing a part, output it in format so user sees what’s happening (announce before doing).

---

## 🎭 Phase 1: CODEBASE ANALYSIS

| Attribute | Value                                     |
| --------- | ----------------------------------------- |
| **Agent** | `scouter`                                 |
| **Goal**  | Scan entire project structure and content |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `scouter`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/scouter.md`
> EMBODY [scouter] — Requires logged system error justification.

**Actions**:

1. List all directories and files
2. Identify tech stack from package.json/config files
3. Map dependencies and relationships
4. Note patterns and conventions used

**Exit Criteria:**

- [ ] Project structure mapped
- [ ] Tech stack identified
- [ ] Key files located

---

## 🎭 Phase 2: GENERATE ALL 5 DOCUMENTS

| Attribute | Value                                                                                                           |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| **Agent** | `docs-manager`                                                                                                  |
| **Goal**  | Create all 5 documentation files in **English only** (headings, body, tables—no user-language content in files) |

### ⚡ TIERED EXECUTION

**TIER 1 (MANDATORY when tool exists):**

> Invoke runSubagent for `docs-manager`. Context: ISOLATED.

**TIER 2 (FALLBACK on system error only):**

> Load `{AGENTS_PATH}/docs-manager.md`
> EMBODY [docs-manager] — Requires logged system error justification.

**Exit Criteria:**

- [ ] `knowledge-overview.md` created
- [ ] `knowledge-architecture.md` created
- [ ] `knowledge-domain.md` created
- [ ] `knowledge-source-base.md` created
- [ ] `knowledge-standards.md` created

---

## ✅ VERIFICATION

Before completion, verify ALL 5 files exist:

```
./documents/
├── ✅ knowledge-overview.md
├── ✅ knowledge-architecture.md
├── ✅ knowledge-domain.md
├── ✅ knowledge-source-base.md
└── ✅ knowledge-standards.md
```

---

## COMPLETION

Report status:

1. ✅ **Complete** — All 5 core docs created
2. ❌ **Incomplete** — List missing files
3. 📝 **Continue** → `/docs:business` for business docs
