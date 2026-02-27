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
