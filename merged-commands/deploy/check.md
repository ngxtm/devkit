---
description: Deploy Check — Pre-deployment readiness verification
version: "1.0"
category: operations
execution-mode: execute
---

# /deploy:check — Deployment Readiness Check

> **MISSION**: Verify all deployment prerequisites are met before proceeding.

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: CODE QUALITY CHECK

| Attribute | Value |
|-----------|-------|
| **Role** | `reviewer` |
| **Goal** | Verify code quality standards |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a reviewer. Verify code quality standards are met. Exit when no critical issues remain, standards are met, and code is approved for deploy.", description="reviewer: Verify code quality standards")

**Exit Criteria:**

- [ ] No critical issues
- [ ] Standards met
- [ ] Approved for deploy

---

## Phase 2: TEST VERIFICATION

| Attribute | Value |
|-----------|-------|
| **Role** | `tester` |
| **Goal** | Verify all tests passing |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tester. Verify all tests are passing with adequate coverage and no flaky tests. Exit when all tests pass, coverage is adequate, and no flaky tests exist.", description="tester: Verify all tests passing")

**Exit Criteria:**

- [ ] All tests pass
- [ ] Coverage adequate
- [ ] No flaky tests

---

## Phase 3: SECURITY SCAN

| Attribute | Value |
|-----------|-------|
| **Role** | `security-engineer` |
| **Goal** | Security vulnerability check |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a security-engineer. Perform a security vulnerability check. Exit when no critical vulnerabilities exist, dependencies are secure, and secrets are not exposed.", description="security-engineer: Security vulnerability check")

**Exit Criteria:**

- [ ] No critical vulnerabilities
- [ ] Dependencies secure
- [ ] Secrets not exposed

---

## Phase 4: INFRASTRUCTURE CHECK

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Goal** | Verify infrastructure readiness |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Verify infrastructure readiness for deployment. Exit when build succeeds, environment is configured, and rollback plan is ready.", description="devops-engineer: Verify infrastructure readiness")

**Exit Criteria:**

- [ ] Build succeeds
- [ ] Environment configured
- [ ] Rollback plan ready

---

## COMPLETION

Present readiness report with:

1. **Ready** → `/deploy:preview` or `/deploy:production`
2. **Not Ready** — Issues to address
3. **Fix Issues** → Route to appropriate fix workflow
