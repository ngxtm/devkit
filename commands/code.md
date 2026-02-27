---
description: 💻 Code Router — Route to implementation workflows
version: "1.0"
category: engineering
execution-mode: router
---

# /code — Implementation Router

> **ROUTER DIRECTIVE**: Analyze task complexity and route to appropriate implementation workflow.

<task>$ARGUMENTS</task>

---

## ROUTING LOGIC

```
IF task is simple (clear requirements, single file):
  → Route to /code:fast

IF task is complex (multi-file, research needed):
  → Route to /code:hard

IF unsure:
  → Default to /code:fast (escalate if needed)
```

---

## AVAILABLE ROUTES

| Route        | When to Use                              |
| ------------ | ---------------------------------------- |
| `/code:fast` | Quick implementation, clear requirements |
| `/code:hard` | Complex features, multi-file changes     |

---

## PRESENT OPTIONS

```markdown
## 💻 Implementation Mode Selection

**Task**: [parsed task]

**Choose workflow:**

1. ⚡ **Fast** → `/code:fast` — Quick implementation
2. ⚡⚡⚡ **Hard** → `/code:hard` — Full development cycle

⏳ Awaiting selection...
```
