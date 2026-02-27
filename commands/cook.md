---
description: 🍳 Cook Router — Route to feature implementation workflows
version: "1.0"
category: engineering
execution-mode: router
---

# /cook — Feature Implementation Router

> **ROUTER DIRECTIVE**: Analyze feature complexity and route to appropriate implementation workflow.

<feature>$ARGUMENTS</feature>

---

## ROUTING LOGIC

```
IF feature is simple (clear spec, low complexity):
  → Route to /cook:fast

IF feature is complex (multi-component, research needed):
  → Route to /cook:hard

IF unsure:
  → Default to /cook:fast
```

---

## AVAILABLE ROUTES

| Route        | When to Use                          |
| ------------ | ------------------------------------ |
| `/cook:fast` | Quick features, clear specifications |
| `/cook:hard` | Complex features, full workflow      |

---

## PRESENT OPTIONS

```markdown
## 🍳 Feature Mode Selection

**Feature**: [parsed feature]

**Choose workflow:**

1. ⚡ **Fast** → `/cook:fast` — Quick implementation
2. ⚡⚡⚡ **Hard** → `/cook:hard` — Full feature development

⏳ Awaiting selection...
```
