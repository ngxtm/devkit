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

## 🛑 PRE-FLIGHT (DO FIRST — BLOCKS EXECUTION)

**LOAD now** (in order; path `./rules/` or `~/.{TOOL}/skills/agent-assistant/rules/`):
1. ORCHESTRATION-LAWS.md  
2. ADAPTIVE-EXECUTION.md  
3. EXECUTION-PROTOCOL.md  

**⛔ Do not run any workflow phase until all are loaded.** Follow **all** rules in those files. Then run this file's ROUTING LOGIC, LOAD the chosen variant workflow, and execute it.

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
