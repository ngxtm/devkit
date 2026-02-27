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
