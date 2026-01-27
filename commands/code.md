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

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS EXECUTION)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):
1. ORCHESTRATION-LAWS.md  
2. ADAPTIVE-EXECUTION.md  
3. EXECUTION-PROTOCOL.md  

**⛔ Do not run any workflow phase until all are loaded.** Follow **all** rules in those files. Then run this file's ROUTING LOGIC, LOAD the chosen variant workflow, and execute it.

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
