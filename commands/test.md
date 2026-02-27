---
description: 🧪 Test Router — Route to testing workflows
version: "1.0"
category: validation
execution-mode: router
---

# /test — Testing Router

> **ROUTER DIRECTIVE**: Analyze testing need and route to appropriate workflow.

<scope>$ARGUMENTS</scope>

---

## ROUTING LOGIC

```
IF scope is limited (unit tests, quick check):
  → Route to /test:fast

IF scope is comprehensive (full suite, E2E):
  → Route to /test:hard

IF unsure:
  → Default to /test:fast
```

---

## AVAILABLE ROUTES

| Route        | When to Use             |
| ------------ | ----------------------- |
| `/test:fast` | Quick tests, unit tests |
| `/test:hard` | Full test suite, E2E    |

---

## PRESENT OPTIONS

```markdown
## 🧪 Test Mode Selection

**Scope**: [parsed scope]

**Choose workflow:**

1. ⚡ **Fast** → `/test:fast` — Quick tests
2. ⚡⚡⚡ **Hard** → `/test:hard` — Comprehensive testing

⏳ Awaiting selection...
```
