---
description: 🤖 Autonomous Execution — Full workflow automation
version: "1.0"
category: meta
execution-mode: router
---

# /auto — Autonomous Workflow Orchestrator

> **ROUTER DIRECTIVE**: Analyze task and autonomously execute complete workflow without user intervention between phases.

<task>$ARGUMENTS</task>

---

## ROUTING LOGIC

```
1. Analyze task type
2. Determine optimal workflow
3. Execute all phases autonomously
4. Report only final result
```

---

## 🎭 Phase 1: TASK ANALYSIS

| Attribute | Value |
|-----------|-------|
| **Role** | `tech-lead` |
| **Goal** | Classify task and select workflow |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tech-lead. Classify task and select workflow. [See exit criteria below]", description="tech-lead")

**Exit Criteria:**

- [ ] Task type identified
- [ ] Workflow selected
- [ ] Execution plan created

---

## 🎭 Phase 2: AUTONOMOUS EXECUTION

Execute selected workflow phases without pause:

| Task Type   | Workflow                       |
| ----------- | ------------------------------ |
| Bug/Error   | `/debug:fast` or `/debug:hard` |
| New Feature | `/code:hard`                   |
| Question    | `/ask:fast` or `/ask:hard`     |
| Planning    | `/plan:fast` or `/plan:hard`   |
| Testing     | `/test:fast` or `/test:hard`   |

---

## 🎭 Phase 3: FINAL REPORT

| Attribute | Value |
|-----------|-------|
| **Role** | `tech-lead` |
| **Goal** | Synthesize results and present summary |

### Delegation

> Task(subagent_type="general-purpose", prompt="You are a tech-lead. Synthesize results and present summary. [See exit criteria below]", description="tech-lead")

**Exit Criteria:**

- [ ] All phases completed
- [ ] Results synthesized
- [ ] Summary presented

---

## COMPLETION

Present final result with:

1. ✅ **Done** — Task complete
2. 🔄 **Continue** — Follow-up actions available
