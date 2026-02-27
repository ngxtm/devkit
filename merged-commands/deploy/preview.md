---
description: Deploy Preview — Staging/Preview deployment
version: "1.0"
category: operations
execution-mode: execute
---

# /deploy:preview — Preview Deployment

> **MISSION**: Deploy to preview/staging environment for validation.

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: READINESS CHECK

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Goal** | Quick deployment readiness |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Perform a quick deployment readiness check. Exit when build passes, tests pass, and no blockers exist.", description="devops-engineer: Quick deployment readiness")

**Exit Criteria:**

- [ ] Build passes
- [ ] Tests pass
- [ ] No blockers

---

## Phase 2: DEPLOY

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Goal** | Deploy to preview environment |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Deploy to preview environment. Exit when deployment is successful and environment is accessible.", description="devops-engineer: Deploy to preview environment")

**Exit Criteria:**

- [ ] Deployment successful
- [ ] Environment accessible

---

## Phase 3: VERIFICATION

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Goal** | Verify deployment health |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Verify deployment health. Exit when health checks pass, core functionality is verified, and preview URL is accessible.", description="devops-engineer: Verify deployment health")

**Exit Criteria:**

- [ ] Health checks pass
- [ ] Core functionality verified
- [ ] Preview URL accessible

---

## COMPLETION

Present deployment result with:

1. **Success** — Preview ready for testing
2. **Promote** → `/deploy:production`
3. **Rollback** → `/deploy:rollback`
