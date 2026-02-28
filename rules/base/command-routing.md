# Command Routing Guide

> Help Claude choose the right command and execution mode for each task.

## Decision Tree

```
Is this a learning/educational request?
  → /learn

Is this brainstorming/ideation only (no code)?
  → /brainstorm

Is this just planning (no implementation)?
  → /plan

Is this a bug fix?
  → /fix (simple) or /fix:hard (complex)

Is this a small, well-defined task?
  → /cook:fast

Is this a medium task with clear requirements?
  → /cook:auto (auto: plan → code → commit)
  → OR /plan → /code (manual control)

Is this a complex, full-lifecycle feature?
  → /cook:hard (includes brainstorm+research+plan+code+test+review)
  → OR /brainstorm → /plan → /code (manual, more control)
```

## Anti-Patterns

- **NEVER** chain `/brainstorm` → `/plan` before `/cook:hard` — it already includes both internally, causing duplicate work
- **NEVER** use `/cook:hard` for trivial fixes — overkill, wastes context
- **NEVER** use `/cook:fast` for complex features — skips research/design, leads to rework

## Command Reference

| Command | Complexity | Multi-Agent | Best For |
|---------|-----------|-------------|----------|
| `/cook:fast` | Low | Light (scouter, engineer) | Well-defined small tasks |
| `/cook` | Medium | Yes (full team) | Standard feature work |
| `/cook:auto` | Medium | Yes (plan → code → git) | Autonomous implementation |
| `/cook:hard` | High | Full (8 phases, all agents) | Complex features from scratch |
| `/brainstorm` | N/A | No | Ideation, design exploration |
| `/plan` | N/A | Optional (researcher) | Creating implementation plans |
| `/code` | Medium | Yes (tester, reviewer) | Executing an existing plan |
| `/learn` | N/A | No | Interactive tutorials |
| `/fix` | Low | No | Quick bug fixes |
| `/fix:hard` | Medium | Yes (debugger, tester) | Complex debugging |

## When to Suggest Skills

After choosing the right command, check if a domain-specific skill would help:
- User says "react" → suggest `/react-expert` skill alongside chosen command
- User says "auth" → suggest `/auth-implementation-patterns` skill
- See `auto-skill.md` for full detection flow
