---
description: Create a new agent skill
argument-hint: [prompt-or-llms-or-github-url]
---

Ultrathink.
Use `skill-creator` skill and Task agent for Claude Code guidance: Task(subagent_type="general-purpose", prompt="You are a claude-code-guide...", description="Claude Code guidance").
Use `docs-seeker` skills to search for documentation if needed.

## Your mission
Create a new skill in `.claude/skills/` directory.

## Requirements
<user-prompt>$ARGUMENTS</user-prompt>

## Rules of Skill Creation:
Base on the requirements:
- Always keep in mind that `SKILL.md` and reference files should be token consumption efficient, so that **progressive disclosure** can be leveraged at best.
- `SKILL.md` is always short and concise, straight to the point, treat it as a quick reference guide.
- If you're given nothing, use `AskUserQuestion` tool for clarifications and Task agent for research to research about the topic: Task(subagent_type="general-purpose", prompt="You are a researcher. Research...", description="Research topic").
- If you're given an URL, it's documentation page, use Task agent for exploration to explore every internal link and report back to main agent, don't skip any link: Task(subagent_type="general-purpose", prompt="You are an explorer. Explore all internal links...", description="Explore URL").
- If you receive a lot of URLs, use multiple Task agents for exploration to explore them in parallel, then report back to main agent.
- If you receive a lot of files, use multiple Task agents for exploration to explore them in parallel, then report back to main agent.
- If you're given a Github URL, use [`repomix`](https://repomix.com/guide/usage) command to summarize ([install it](https://repomix.com/guide/installation) if needed) and spawn multiple Task agents for exploration to explore it in parallel, then report back to main agent.

**IMPORTANT:**
- Skills are not documentation, they are practical instructions for Claude Code to use the tools, packages, plugins or APIs to achieve the tasks.
- Each skill teaches Claude how to perform a specific development task, not what a tool does.
- Claude Code can activate multiple skills automatically to achieve the user's request.