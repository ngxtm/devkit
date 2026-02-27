---
description: Audit Docs — Generate 4 security and compliance documentation files
version: "1.0"
category: documentation
execution-mode: execute
---

# /docs:audit — Security & Compliance Documentation

> **MISSION**: Generate **ALL 4** audit documentation files.

<scope>$ARGUMENTS</scope>

---

## DELIVERABLES (REQUIRED — ALL 4 FILES)

> [!CAUTION]
> **MUST CREATE ALL 4 FILES**. Incomplete = FAILED execution.

> **DOCUMENT LANGUAGE — NON-NEGOTIABLE**
> Every file under `./documents/` must be written in **English only**. Do not use the user's language (e.g. Vietnamese) for file content.

| File                                         | Purpose                          |
| -------------------------------------------- | -------------------------------- |
| `./documents/audit/audit-security.md`        | Security assessment and findings |
| `./documents/audit/audit-compliance.md`      | Compliance status and gaps       |
| `./documents/audit/audit-dataflow.md`        | Data flow and privacy analysis   |
| `./documents/audit/audit-recommendations.md` | Remediation recommendations      |

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: SECURITY ANALYSIS

| Attribute | Value                        |
| --------- | ---------------------------- |
| **Role**  | `security-engineer`          |
| **Goal**  | Complete security assessment |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a security-engineer. Perform a complete security assessment. Exit when vulnerabilities are identified, OWASP checklist is complete, and risk assessment is done.", description="security-engineer: Complete security assessment")

**Exit Criteria:**

- [ ] Vulnerabilities identified
- [ ] OWASP checklist complete
- [ ] Risk assessment done

---

## Phase 2: CODEBASE SCAN

| Attribute | Value                              |
| --------- | ---------------------------------- |
| **Role**  | `scouter`                          |
| **Goal**  | Map data flows and sensitive areas |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a scouter. Map data flows and sensitive areas in the codebase. Exit when data flows are mapped, sensitive data is identified, and integration points are cataloged.", description="scouter: Map data flows and sensitive areas")

**Exit Criteria:**

- [ ] Data flows mapped
- [ ] Sensitive data identified
- [ ] Integration points cataloged

---

## Phase 3: GENERATE ALL 4 DOCUMENTS

| Attribute | Value                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------- |
| **Role**  | `docs-manager`                                                                                 |
| **Goal**  | Create all 4 audit documentation files in **English only** (no user-language content in files) |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a docs-manager. Create all 4 audit documentation files in English only: audit-security.md, audit-compliance.md, audit-dataflow.md, audit-recommendations.md. Exit when all 4 files are created.", description="docs-manager: Create all 4 audit documentation files")

**Exit Criteria:**

- [ ] `audit-security.md` created
- [ ] `audit-compliance.md` created
- [ ] `audit-dataflow.md` created
- [ ] `audit-recommendations.md` created

---

## VERIFICATION

Before completion, verify ALL 4 files exist:

```
./documents/audit/
├── audit-security.md
├── audit-compliance.md
├── audit-dataflow.md
└── audit-recommendations.md
```

---

## COMPLETION

Report status:

1. **Complete** — All 4 audit docs created
2. **Incomplete** — List missing files
3. **Follow-up** — Address critical findings
