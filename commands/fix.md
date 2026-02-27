---
description: 🔧 Fix Router — Route to issue resolution workflows
version: "1.0"
category: debugging
execution-mode: router
---

# /fix — Issue Resolution Router

> **ROUTER DIRECTIVE**: Analyze issue complexity and route to appropriate fix workflow.

<issue>$ARGUMENTS</issue>

---

## ROUTING LOGIC

```
IF issue is simple (clear cause, quick fix):
  → Route to /fix:fast

IF issue is complex (research needed, multi-file):
  → Route to /fix:hard

IF unsure:
  → Default to /fix:fast (escalate if needed)
```

---

## AVAILABLE ROUTES

| Route       | When to Use                     |
| ----------- | ------------------------------- |
| `/fix:fast` | Quick fixes, clear issues       |
| `/fix:hard` | Complex issues, research needed |

---

## PRESENT OPTIONS

```markdown
## 🔧 Fix Mode Selection

**Issue**: [parsed issue]

**Choose workflow:**

1. ⚡ **Fast** → `/fix:fast` — Quick fix
2. ⚡⚡⚡ **Hard** → `/fix:hard` — Full resolution

⏳ Awaiting selection...
```
