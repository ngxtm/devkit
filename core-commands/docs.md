---
description: 📝 Docs — Full Documentation Suite (executes ALL sub-commands sequentially)
version: "1.0"
category: documentation
execution-mode: execute
---

# /docs — Full Documentation Suite

> **MISSION**: Execute ALL documentation sub-commands **SEQUENTIALLY**. Only report "Done" when ALL 13 files are created.

<scope>$ARGUMENTS</scope>

---

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS EXECUTION)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):

1. ORCHESTRATION-LAWS.md
2. ADAPTIVE-EXECUTION.md
3. EXECUTION-PROTOCOL.md

**⛔ Do not run any workflow phase until all are loaded.** Follow **all** rules in those files. Then run this file's ROUTING LOGIC, LOAD the chosen variant (e.g. docs/core.md), and execute it.

---

## ⚠️ EXECUTION RULES (NON-NEGOTIABLE)

> [!CAUTION]
>
> 1. You MUST execute each sub-command **IN ORDER**
> 2. You MUST wait for each sub-command to **COMPLETE** before starting next
> 3. You MUST create **ALL 13 FILES** across 3 sub-commands
> 4. You may **NOT** skip any sub-command
> 5. Report "Done" **ONLY** when all 13 files exist

---

## 🔄 SEQUENTIAL EXECUTION FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Load & Execute /docs:core                               │
│   → Wait until ALL 5 core files are created                     │
│   → Verify: knowledge-overview, architecture, domain,       │
│   →         source-base, standards                            │
├─────────────────────────────────────────────────────────────────┤
│ STEP 2: Load & Execute /docs:business                           │
│   → Wait until ALL 4 business files are created                 │
│   → Verify: business-prd, features, workflows, glossary         │
├─────────────────────────────────────────────────────────────────┤
│ STEP 3: Load & Execute /docs:audit                              │
│   → Wait until ALL 4 audit files are created                    │
│   → Verify: audit-security, compliance, dataflow,               │
│             recommendations                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## STEP 1: EXECUTE `/docs:core`

| Attribute       | Value                                             |
| --------------- | ------------------------------------------------- |
| **Sub-Command** | `~/.{TOOL}/agent-assistant/commands/docs/core.md` |
| **Action**      | **LOAD AND FOLLOW** the entire core.md workflow   |

### Files to be Created:

- [ ] `./documents/knowledge-overview.md`
- [ ] `./documents/knowledge-architecture.md`
- [ ] `./documents/knowledge-domain.md`
- [ ] `./documents/knowledge-source-base.md`
- [ ] `./documents/knowledge-standards.md`

**⏸️ PAUSE HERE** — Do NOT proceed to Step 2 until all 5 core files exist.

---

## STEP 2: EXECUTE `/docs:business`

| Attribute       | Value                                                 |
| --------------- | ----------------------------------------------------- |
| **Sub-Command** | `~/.{TOOL}/agent-assistant/commands/docs/business.md` |
| **Action**      | **LOAD AND FOLLOW** the entire business.md workflow   |

### Files to be Created:

- [ ] `./documents/business/business-prd.md`
- [ ] `./documents/business/business-features.md`
- [ ] `./documents/business/business-workflows.md`
- [ ] `./documents/business/business-glossary.md`

**⏸️ PAUSE HERE** — Do NOT proceed to Step 3 until all 4 business files exist.

---

## STEP 3: EXECUTE `/docs:audit`

| Attribute       | Value                                              |
| --------------- | -------------------------------------------------- |
| **Sub-Command** | `~/.{TOOL}/agent-assistant/commands/docs/audit.md` |
| **Action**      | **LOAD AND FOLLOW** the entire audit.md workflow   |

### Files to be Created:

- [ ] `./documents/audit/audit-security.md`
- [ ] `./documents/audit/audit-compliance.md`
- [ ] `./documents/audit/audit-dataflow.md`
- [ ] `./documents/audit/audit-recommendations.md`

---

## ✅ FINAL VERIFICATION (REQUIRED)

Before reporting "Done", verify **ALL 13 FILES** exist:

```
./documents/
├── Core (5 files)
│   ├── ✅ knowledge-overview.md
│   ├── ✅ knowledge-architecture.md
│   ├── ✅ knowledge-domain.md
│   ├── ✅ knowledge-source-base.md
│   └── ✅ knowledge-standards.md
├── Business (folder)
│   ├── ✅ business-prd.md
│   ├── ✅ business-features.md
│   ├── ✅ business-workflows.md
│   └── ✅ business-glossary.md
└── Audit (4 files)
    ├── ✅ audit-security.md
    ├── ✅ audit-compliance.md
    ├── ✅ audit-dataflow.md
    └── ✅ audit-recommendations.md
```

---

## 📊 COMPLETION OUTPUT

Only output this when ALL 13 files are verified:

```markdown
## ✅ Full Documentation Suite Complete

### 📁 All 13 Documents Created

| Type     | Files Created                                        | Status |
| -------- | ---------------------------------------------------- | ------ |
| Core     | overview, architecture, domain, source-base, standards | ✅ 5/5 |
| Business | prd, features, workflows, glossary                   | ✅ 4/4 |
| Audit    | security, compliance, dataflow, recommendations      | ✅ 4/4 |

**Total: 13/13 files created in `./documents/`**
```

---

## 🚫 FORBIDDEN

- ❌ Skipping any sub-command
- ❌ Creating partial files and reporting "Done"
- ❌ Executing sub-commands in parallel (must be sequential)
- ❌ Reporting "Done" before all 12 files exist

---

## 📌 INDIVIDUAL ROUTES (Still Available)

If you need only ONE type:

| Route            | Files Created        |
| ---------------- | -------------------- |
| `/docs:core`     | 5 knowledge-\* files |
| `/docs:business` | 4 business-\* files  |
| `/docs:audit`    | 4 audit-\* files     |
