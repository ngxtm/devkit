---
description: "\U0001F504 Recover context from a previous session checkpoint"
---

Look for checkpoint files in `.claude/sessions/` directory and recover context from a previous session.

## Workflow

1. **Check git**: Run `git rev-parse --is-inside-work-tree 2>/dev/null` to detect git repo
2. **Get branch**: If git repo, run `git branch --show-current` to get current branch
3. **Find checkpoints**: Glob `.claude/sessions/*.md` to list all checkpoint files
4. **Cleanup stale**: Delete any checkpoint files older than 7 days (abandoned sessions)
5. **Check results**: If no checkpoints remain → tell user "No active checkpoints found"
6. **Filter by branch**: If git repo, filter checkpoints matching `branch:{current-branch}` in the first line. If no match on current branch, show all checkpoints with branch labels.
7. **Show recent**: Display max 5 most recent checkpoints (sorted by filename date prefix `YYMMDD-HHMM`)
8. **Select**: If only 1 match → read it automatically. If multiple → always list them and let user pick using `AskUserQuestion`.
9. **Validate**: Verify the checkpoint file has a `#` header line and a `## Next Action` section. If malformed, skip it and try the next one.
10. **Display summary**: Show the checkpoint's task description, current phase, progress (done/pending), next action, and referenced plan file
11. **Confirm**: Ask user "Continue from this checkpoint?"
12. **Resume**: If yes → read the referenced plan file (if any) and proceed with the Next Action from the checkpoint

**IMPORTANT**: For non-git projects, skip branch filtering and show all checkpoints.
