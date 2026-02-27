---
description: Deploy Rollback — Revert to previous deployment
version: "1.0"
category: operations
execution-mode: execute
---

# /deploy:rollback — Deployment Rollback

> **MISSION**: Safely rollback to previous stable deployment.

---

## Execution
One phase at a time, sequential. Each phase must complete before next begins.

---

## Phase 1: ASSESS SITUATION

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Goal** | Identify rollback target |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Identify the rollback target. Exit when current state is documented, rollback target is identified, and impact is assessed.", description="devops-engineer: Identify rollback target")

**Exit Criteria:**

- [ ] Current state documented
- [ ] Rollback target identified
- [ ] Impact assessed

---

## Phase 2: EXECUTE ROLLBACK

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Goal** | Execute rollback procedure |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Execute the rollback procedure. Exit when rollback is complete and previous version is deployed.", description="devops-engineer: Execute rollback procedure")

**Exit Criteria:**

- [ ] Rollback complete
- [ ] Previous version deployed

---

## Phase 3: VERIFICATION

| Attribute | Value |
|-----------|-------|
| **Role** | `devops-engineer` |
| **Goal** | Verify rollback success |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a devops-engineer. Verify rollback success. Exit when health checks pass, previous functionality is restored, and issue is resolved.", description="devops-engineer: Verify rollback success")

**Exit Criteria:**

- [ ] Health checks pass
- [ ] Previous functionality restored
- [ ] Issue resolved

---

## Phase 4: ROOT CAUSE ANALYSIS

| Attribute | Value |
|-----------|-------|
| **Role** | `debugger` |
| **Goal** | Document what went wrong |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a debugger. Document what went wrong with the deployment. Exit when failure is documented, root cause is identified, and prevention plan is noted.", description="debugger: Document what went wrong")

**Exit Criteria:**

- [ ] Failure documented
- [ ] Root cause identified
- [ ] Prevention plan noted

---

## COMPLETION

Present rollback result with:

1. **Rolled Back** — System stable
2. **Debug** → `/debug:hard` for root cause
3. **Document** — Post-mortem documentation
