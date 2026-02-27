---
description: 📋 Plan Router — Route to planning workflows
version: "1.0"
category: planning
execution-mode: router
---

# /plan — Planning Router

> **ROUTER DIRECTIVE**: Analyze planning need and route to appropriate workflow.

<task>$ARGUMENTS</task>

---

## ROUTING LOGIC

```
IF task is clear (known approach, codebase-only):
  → Route to /plan:fast

IF task is complex (research needed, architectural):
  → Route to /plan:hard

IF unsure:
  → Default to /plan:fast
```

---

## AVAILABLE ROUTES

| Route        | When to Use                     |
| ------------ | ------------------------------- |
| `/plan:fast` | Quick planning without research |
| `/plan:hard` | Full planning with research     |

---

## PRESENT OPTIONS

```markdown
## 📋 Planning Mode Selection

**Task**: [parsed task]

**Choose workflow:**

1. ⚡ **Fast** → `/plan:fast` — Quick plan
2. ⚡⚡⚡ **Hard** → `/plan:hard` — Full research-backed plan

⏳ Awaiting selection...
```
