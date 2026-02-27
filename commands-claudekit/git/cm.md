---
description: Stage all files and create a commit.
---
Use Task agent for git management: Task(subagent_type="general-purpose", prompt="You are a git-manager. Analyze changes, categorize commits, stage and commit...", description="Git commit") to:
- Analyze changes with `git status` and `git diff --stat`
- Categorize changes into multiple commits
- Stage files and create commits based on the changes made
- Use conventional commit format with changelog in body
**IMPORTANT: DO NOT push the changes to remote repository**
