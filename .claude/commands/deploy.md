---
description: 🚀 Deploy Router — Route to deployment workflows
version: "1.0"
category: operations
execution-mode: router
---

# /deploy — Deployment Router

> **ROUTER DIRECTIVE**: Analyze deployment target and route to appropriate workflow.

<target>$ARGUMENTS</target>

---

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS EXECUTION)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):
1. ORCHESTRATION-LAWS.md  
2. ADAPTIVE-EXECUTION.md  
3. EXECUTION-PROTOCOL.md  

**⛔ Do not run any workflow phase until all are loaded.** Follow **all** rules in those files. Then run this file's ROUTING LOGIC, LOAD the chosen variant workflow, and execute it.

---

## Graph-Aware Skill Loading

After routing to deploy variant, load relevant skills from `skills-compact.json`:

1. Read `skills-compact.json` → find deployment/infrastructure domain skills (by `k` field)
2. Check `_recipes` — if task triggers a recipe, load recipe skills in workflow order
3. Use cascade connections (`e`/`p` fields) to find related deployment skills
4. Follow cascade protocol from `auto-skill.md` for weight-aware loading
5. Max 3 additional skills, max 5 total loaded

---

## ROUTING LOGIC

```
IF target is "check" or "status":
  → Route to /deploy:check

IF target is "preview" or "staging":
  → Route to /deploy:preview

IF target is "production" or "prod":
  → Route to /deploy:production

IF target is "rollback":
  → Route to /deploy:rollback
```

---

## AVAILABLE ROUTES

| Route                | When to Use                    |
| -------------------- | ------------------------------ |
| `/deploy:check`      | Pre-deployment readiness check |
| `/deploy:preview`    | Deploy to preview/staging      |
| `/deploy:production` | Deploy to production           |
| `/deploy:rollback`   | Rollback deployment            |

---

## PRESENT OPTIONS

```markdown
## 🚀 Deployment Mode Selection

**Target**: [parsed target]

**Choose workflow:**

1. ✅ **Check** → `/deploy:check` — Readiness verification
2. 🔍 **Preview** → `/deploy:preview` — Staging deployment
3. 🚀 **Production** → `/deploy:production` — Production release
4. ⏪ **Rollback** → `/deploy:rollback` — Revert deployment

⏳ Awaiting selection...
```
