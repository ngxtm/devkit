---
description: 🎨 Design Router — Route to design workflows
version: "1.0"
category: design
execution-mode: router
---

# /design — Design Router

> **ROUTER DIRECTIVE**: Analyze design need and route to appropriate workflow.

<request>$ARGUMENTS</request>

---

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS EXECUTION)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):
1. ORCHESTRATION-LAWS.md  
2. ADAPTIVE-EXECUTION.md  
3. EXECUTION-PROTOCOL.md  

**⛔ Do not run any workflow phase until all are loaded.** Follow **all** rules in those files. Then run this file's ROUTING LOGIC, LOAD the chosen variant workflow, and execute it.

---

## Graph-Aware Skill Loading

After routing to design variant, load relevant skills from `skills-compact.json`:

1. Read `skills-compact.json` → find design/UI/UX domain skills (by `k` field)
2. Check `_recipes` — if task triggers a recipe, load recipe skills in workflow order
3. Use cascade connections (`e`/`p` fields) to find related design skills
4. Follow cascade protocol from `auto-skill.md` for weight-aware loading
5. Max 3 additional skills, max 5 total loaded

---

## ROUTING LOGIC

```
IF design is simple (component, quick mockup):
  → Route to /design:fast

IF design is complex (full feature, system):
  → Route to /design:hard

IF unsure:
  → Default to /design:fast
```

---

## AVAILABLE ROUTES

| Route          | When to Use                        |
| -------------- | ---------------------------------- |
| `/design:fast` | Quick component design, simple UI  |
| `/design:hard` | Full feature design, system design |

---

## PRESENT OPTIONS

```markdown
## 🎨 Design Mode Selection

**Request**: [parsed request]

**Choose workflow:**

1. ⚡ **Fast** → `/design:fast` — Quick design
2. ⚡⚡⚡ **Hard** → `/design:hard` — Full design process

⏳ Awaiting selection...
```
