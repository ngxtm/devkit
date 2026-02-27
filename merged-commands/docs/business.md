---
description: Business Docs — Generate 4 business documentation files
version: "1.0"
category: documentation
execution-mode: execute
---

# /docs:business — Business Documentation

> **MISSION**: Generate **ALL 4** business documentation files.

<scope>$ARGUMENTS</scope>

---

## DELIVERABLES (REQUIRED — ALL 4 FILES)

> [!CAUTION]
> **MUST CREATE ALL 4 FILES**. Incomplete = FAILED execution.

> **DOCUMENT LANGUAGE — NON-NEGOTIABLE**
> Every file under `./documents/` must be written in **English only**. Do not use the user's language (e.g. Vietnamese) for file content.

| File                                         | Purpose                       |
| -------------------------------------------- | ----------------------------- |
| `./documents/business/business-prd.md`       | Product requirements document |
| `./documents/business/business-features.md`  | Feature specifications        |
| `./documents/business/business-workflows.md` | Business processes and flows  |
| `./documents/business/business-glossary.md`  | Domain terms and definitions  |

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: CODEBASE & REQUIREMENTS ANALYSIS

| Attribute | Value                                |
| --------- | ------------------------------------ |
| **Role**  | `scouter`                            |
| **Goal**  | Identify business logic and features |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Identify business logic and features in the codebase. Exit when business logic is identified, features are cataloged, and domain terms are noted.", description="scouter: Identify business logic and features")

**Exit Criteria:**

- [ ] Business logic identified
- [ ] Features cataloged
- [ ] Domain terms noted

---

## Phase 2: BUSINESS ANALYSIS

| Attribute | Value                    |
| --------- | ------------------------ |
| **Role**  | `business-analyst`       |
| **Goal**  | Analyze business context |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a business-analyst. Analyze business context. Exit when business goals are understood, stakeholders are identified, and workflows are mapped.", description="business-analyst: Analyze business context")

**Exit Criteria:**

- [ ] Business goals understood
- [ ] Stakeholders identified
- [ ] Workflows mapped

---

## Phase 3: GENERATE ALL 4 DOCUMENTS

| Attribute | Value                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------- |
| **Role**  | `docs-manager`                                                                                    |
| **Goal**  | Create all 4 business documentation files in **English only** (no user-language content in files) |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a docs-manager. Create all 4 business documentation files in English only: business-prd.md, business-features.md, business-workflows.md, business-glossary.md. Exit when all 4 files are created.", description="docs-manager: Create all 4 business documentation files")

**Exit Criteria:**

- [ ] `business-prd.md` created
- [ ] `business-features.md` created
- [ ] `business-workflows.md` created
- [ ] `business-glossary.md` created

---

## VERIFICATION

Before completion, verify ALL 4 files exist:

```
./documents/business/
├── business-prd.md
├── business-features.md
├── business-workflows.md
└── business-glossary.md
```

---

## COMPLETION

Report status:

1. **Complete** — All 4 business docs created
2. **Incomplete** — List missing files
3. **Continue** → `/docs:audit` for audit docs
