---
description: Full Review — Deep code analysis with architecture review
version: "1.0"
category: validation
execution-mode: execute
---

# /review:hard — Deep Code Review

> **MISSION**: Comprehensive code and architecture review.

<scope>$ARGUMENTS</scope>

---

## PLAN COMPLIANCE CHECK

```
IF ./reports/plans/PLAN-{scope}.md exists:
  - Verify code implements plan specification
  - Check for unauthorized deviations
  - Ensure all phases reflected in code
```

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: ARCHITECTURE REVIEW

| Attribute | Value |
|-----------|-------|
| **Role** | `tech-lead` |
| **Goal** | Review architecture decisions |
| **Exit** | Architecture assessed, patterns validated |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tech-lead. Review architecture decisions. Exit when architecture is assessed and patterns are validated.", description="tech-lead: Review architecture decisions")

---

## Phase 2: CODE REVIEW

| Attribute | Value |
|-----------|-------|
| **Role** | `reviewer` |
| **Prerequisite** | READ PLAN file if exists |
| **Goal** | Deep code analysis |
| **Exit** | Code quality assessed, issues documented |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a reviewer. Perform deep code analysis. Read the PLAN file if it exists. Exit when code quality is assessed and issues are documented.", description="reviewer: Deep code analysis")

---

## Phase 3: SECURITY REVIEW

| Attribute | Value |
|-----------|-------|
| **Role** | `security-engineer` |
| **Goal** | Security assessment |
| **Exit** | Security reviewed, vulnerabilities documented |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a security-engineer. Perform a security assessment. Exit when security is reviewed and vulnerabilities are documented.", description="security-engineer: Security assessment")

---

## Phase 4: PERFORMANCE REVIEW

| Attribute | Value |
|-----------|-------|
| **Role** | `performance-engineer` |
| **Goal** | Performance assessment |
| **Exit** | Performance issues identified |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a performance-engineer. Perform a performance assessment. Exit when performance issues are identified.", description="performance-engineer: Performance assessment")

---

## COMPLETION

Present review with:

1. **Approved** — Code ready
2. **Fix** → `/fix`
3. **Test** → `/test`
