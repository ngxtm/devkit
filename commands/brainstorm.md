---
description: 💡 Brainstorm Router — Route to ideation workflows
version: "1.0"
category: planning
execution-mode: router
---

# /brainstorm — Ideation Router

> **ROUTER DIRECTIVE**: Analyze ideation need and route to appropriate brainstorming workflow.

<topic>$ARGUMENTS</topic>

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
IF topic is clear (quick ideas, simple exploration):
  → Route to /brainstorm:fast

IF topic is complex (research needed, deep analysis):
  → Route to /brainstorm:hard

IF unsure:
  → Default to /brainstorm:fast
```

---

## AVAILABLE ROUTES

| Route              | When to Use                            |
| ------------------ | -------------------------------------- |
| `/brainstorm:fast` | Quick ideation, simple exploration     |
| `/brainstorm:hard` | Research-backed ideation with analysis |

---

## PRESENT OPTIONS

```markdown
## 💡 Brainstorm Mode Selection

**Topic**: [parsed topic]

**Choose workflow:**

1. ⚡ **Fast** → `/brainstorm:fast` — Quick ideation
2. ⚡⚡⚡ **Hard** → `/brainstorm:hard` — Deep exploration

⏳ Awaiting selection...
```
