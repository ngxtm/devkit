---
description: 🔍 Review Router — Route to code review workflows
version: "1.0"
category: validation
execution-mode: router
---

# /review — Code Review Router

> **ROUTER DIRECTIVE**: Analyze review scope and route to appropriate workflow.

<scope>$ARGUMENTS</scope>

---

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS EXECUTION)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):
1. ORCHESTRATION-LAWS.md  
2. ADAPTIVE-EXECUTION.md  
3. EXECUTION-PROTOCOL.md  

**⛔ Do not run any workflow phase until all are loaded.** Follow **all** rules in those files. Then run this file's ROUTING LOGIC, LOAD the chosen variant workflow, and execute it.

---

## Graph-Aware Skill Loading

After routing to review variant, load relevant skills from `skills-compact.json`:

1. Read `skills-compact.json` → find review/quality skills by `k` (domain) field
2. Use cascade connections (`e`/`p` fields) to find related review skills
3. If code involves security-sensitive areas → find skills with `k` containing "security", "auth"
4. If code involves performance-sensitive areas → find skills with `k` containing "performance", "optimization"
5. Follow cascade protocol from `auto-skill.md` for weight-aware loading
6. Max 3 additional skills, max 5 total loaded

---

## ROUTING LOGIC

```
IF scope is small (PR, few files):
  → Route to /review:fast

IF scope is large (codebase, architecture):
  → Route to /review:hard

IF unsure:
  → Default to /review:fast
```

---

## AVAILABLE ROUTES

| Route          | When to Use            |
| -------------- | ---------------------- |
| `/review:fast` | Quick PR/file review   |
| `/review:hard` | Deep codebase analysis |

---

## PRESENT OPTIONS

```markdown
## 🔍 Review Mode Selection

**Scope**: [parsed scope]

**Choose workflow:**

1. ⚡ **Fast** → `/review:fast` — Quick review
2. ⚡⚡⚡ **Hard** → `/review:hard` — Deep analysis

⏳ Awaiting selection...
```
