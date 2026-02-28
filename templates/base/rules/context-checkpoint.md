# Context Checkpoint

Auto-save session state to `.claude/sessions/` for context recovery.

## When to Checkpoint
After completing a subtask: implementing a feature step, running tests, phase transitions,
receiving Task agent results, making key decisions.
Do NOT checkpoint per individual file edit — wait until the subtask is complete.

## Skip Checkpoint
Simple Q&A, exploration reads, brainstorming, tasks completing in < 3 steps.

## Protocol
1. First checkpoint → ensure `.claude/sessions` is covered by `.gitignore`
   (skip if `.claude/` or `.claude/sessions` already in gitignore), then create
   `.claude/sessions/{YYMMDD-HHMM-desc}.md`
2. Include `branch:{branch}` in header if in a git repo. Omit if not git.
3. Update same file at each subsequent trigger. Silent — don't announce.
4. Keep each section to 10 items max. Summarize older items if needed.
5. On task completion → delete the checkpoint file.

## Recovery
If you recall working on a task but notice gaps in your prior context (earlier messages
seem compressed or summarized), check `.claude/sessions/` for a matching checkpoint
to restore state. Verify checkpoint has a `#` header and `## Next Action` before using.
Say: "Resumed from checkpoint. Continuing..."
Do NOT auto-load checkpoints in a fresh session — use `/recover` for cross-session.

## Format
```
# {desc} | {command} | {phase} | branch:{branch}
## Plan — {path or "none"}
## Done — {bullets}
## Pending — {bullets}
## Decisions — {bullets}
## Next Action — {exact step}
## Files — Modified: {list} | Remaining: {list}
```
