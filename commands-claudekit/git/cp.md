---
description: Stage, commit and push all code in the current branch
---
Use Task agent for git management: Task(subagent_type="general-purpose", prompt="You are a git-manager. Analyze changes, categorize commits, stage, commit, and push...", description="Git commit and push") to:
- Analyze changes with `git status` and `git diff --stat`
- Categorize changes into multiple commits
- Stage files and create commits based on the changes made
- Use conventional commit format with changelog in body
- Push to remote after all commits
