---
description: Deploy Production — Production release with safety gates
version: "1.0"
category: operations
execution-mode: execute
---

# /deploy:production — Production Deployment

> **MISSION**: Safely deploy to production with full verification and rollback readiness.

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: FULL READINESS CHECK

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Goal** | Complete pre-production verification |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Complete pre-production verification. Exit when all tests pass, security scan is clean, rollback plan is documented, and monitoring is ready.", description="devops-engineer: Complete pre-production verification")

**Exit Criteria:**

- [ ] All tests pass
- [ ] Security scan clean
- [ ] Rollback plan documented
- [ ] Monitoring ready

---

## Phase 2: SECURITY GATE

| Attribute | Value |
|-----------|-------|
| **Role** | `security-engineer` |
| **Goal** | Final security verification |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a security-engineer. Perform final security verification before production deployment. Exit when no critical vulnerabilities exist, secrets are secured, and deployment is approved for production.", description="security-engineer: Final security verification")

**Exit Criteria:**

- [ ] No critical vulnerabilities
- [ ] Secrets secured
- [ ] Approved for production

---

## Phase 3: PRODUCTION DEPLOY

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Goal** | Execute production deployment |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Execute production deployment. Exit when deployment is successful and zero-downtime is achieved (if applicable).", description="devops-engineer: Execute production deployment")

**Exit Criteria:**

- [ ] Deployment successful
- [ ] Zero-downtime achieved (if applicable)

---

## Phase 4: POST-DEPLOY VERIFICATION

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Goal** | Production health verification |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Verify production health after deployment. Exit when health checks pass, core paths are verified, and monitoring is normal.", description="devops-engineer: Production health verification")

**Exit Criteria:**

- [ ] Health checks pass
- [ ] Core paths verified
- [ ] Monitoring normal

---

## ESCALATION

| Condition          | Route To            |
| ------------------ | ------------------- |
| Deploy fails       | `/deploy:rollback`  |
| Health check fails | `/deploy:rollback`  |
| Security issue     | `security-engineer` |

---

## COMPLETION

Present deployment result with:

1. **Success** — Production deployed
2. **Rollback** → `/deploy:rollback` if issues
3. **Monitor** — Watch dashboards
