---
description: 🐛 Debug Router — Route to debugging workflows
version: "1.0"
category: debugging
execution-mode: router
---

# /debug — Debug Router

> **ROUTER DIRECTIVE**: Analyze issue complexity and route to appropriate debugging workflow.

<issue>$ARGUMENTS</issue>

---

## ROUTING LOGIC

```
IF issue is simple (clear error, reproducible):
  → Route to /debug:fast

IF issue is complex (intermittent, unclear cause):
  → Route to /debug:hard

IF unsure:
  → Default to /debug:fast (escalate if needed)
```

---

## AVAILABLE ROUTES

| Route         | When to Use                           |
| ------------- | ------------------------------------- |
| `/debug:fast` | Quick diagnosis for simple bugs       |
| `/debug:hard` | Deep investigation for complex issues |

---

## PRESENT OPTIONS

```markdown
## 🐛 Debug Mode Selection

**Issue**: [parsed issue]

**Choose workflow:**

1. ⚡ **Fast** → `/debug:fast` — Quick diagnosis
2. ⚡⚡⚡ **Hard** → `/debug:hard` — Deep investigation

⏳ Awaiting selection...
```
