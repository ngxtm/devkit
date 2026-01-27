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

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS EXECUTION)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):
1. ORCHESTRATION-LAWS.md  
2. ADAPTIVE-EXECUTION.md  
3. EXECUTION-PROTOCOL.md  

**⛔ Do not run any workflow phase until all are loaded.** Follow **all** rules in those files. Then run this file's ROUTING LOGIC, LOAD the chosen variant workflow, and execute it.

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
