---
description: Core Docs — Generate 5 essential technical documentation files
version: "1.0"
category: documentation
execution-mode: execute
---

# /docs:core — Core Technical Documentation

> **MISSION**: Analyze current project and generate **ALL 5** essential documentation files.

<scope>$ARGUMENTS</scope>

---

## DELIVERABLES (REQUIRED — ALL 5 FILES)

> [!CAUTION]
> **MUST CREATE ALL 5 FILES**. Incomplete = FAILED execution.

> **DOCUMENT LANGUAGE — NON-NEGOTIABLE**
> Every file under `./documents/` must be written in **English only**. Headings, body text, tables, and lists must be in English. Do not use the user's language (e.g. Vietnamese) for file content. Chat/UI may follow user language; document files do not.

| File                                    | Purpose                                                       |
| --------------------------------------- | ------------------------------------------------------------- |
| `./documents/knowledge-overview.md`     | Project introduction, goals, tech stack, getting started      |
| `./documents/knowledge-architecture.md` | System design, components, data flow, design patterns         |
| `./documents/knowledge-domain.md`       | Data models, database schema, API contracts, domain entities  |
| `./documents/knowledge-source-base.md`  | Directory structure, file purposes, entry points, key modules |
| `./documents/knowledge-standards.md`    | Code style, naming conventions, commit format, guidelines     |

### File Purpose Details

| File | AI Uses It For | Key Sections |
|------|----------------|--------------|
| **overview** | Understanding WHAT the project does and WHY | Purpose, Goals, Tech Stack, Features, Getting Started |
| **architecture** | Understanding HOW components interact | Layers, Components, Data Flow, Design Patterns, Dependencies |
| **domain** | Understanding WHAT DATA the project handles | Entities, Relationships, Database Schema, API Endpoints, Business Rules |
| **source-base** | Understanding WHERE code lives | Directory Tree, Entry Points, Key Files, Module Breakdown |
| **standards** | Understanding HOW to write code correctly | Naming, Style, Commit Format, PR Guidelines, Testing Standards |

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: CODEBASE ANALYSIS

| Attribute | Value                                     |
| --------- | ----------------------------------------- |
| **Role**  | `scouter`                                 |
| **Goal**  | Scan entire project structure and content |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Scan the entire project structure and content. List all directories and files, identify tech stack from package.json/config files, map dependencies and relationships, and note patterns and conventions used. Exit when project structure is mapped, tech stack is identified, and key files are located.", description="scouter: Scan entire project structure and content")

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

## Phase 2: GENERATE ALL 5 DOCUMENTS

| Attribute | Value                                                                                                           |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| **Role**  | `docs-manager`                                                                                                  |
| **Goal**  | Create all 5 documentation files in **English only** (headings, body, tables—no user-language content in files) |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a docs-manager. Create all 5 documentation files in English only: knowledge-overview.md, knowledge-architecture.md, knowledge-domain.md, knowledge-source-base.md, knowledge-standards.md. Exit when all 5 files are created.", description="docs-manager: Create all 5 documentation files")

**Exit Criteria:**

- [ ] `knowledge-overview.md` created
- [ ] `knowledge-architecture.md` created
- [ ] `knowledge-domain.md` created
- [ ] `knowledge-source-base.md` created
- [ ] `knowledge-standards.md` created

---

## VERIFICATION

Before completion, verify ALL 5 files exist:

```
./documents/
├── knowledge-overview.md
├── knowledge-architecture.md
├── knowledge-domain.md
├── knowledge-source-base.md
└── knowledge-standards.md
```

---

## COMPLETION

Report status:

1. **Complete** — All 5 core docs created
2. **Incomplete** — List missing files
3. **Continue** → `/docs:business` for business docs
