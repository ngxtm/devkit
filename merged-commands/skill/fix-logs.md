---
description: Fix the agent skill based on `logs.txt` file.
argument-hint: [prompt-or-path-to-skill]
---

Think harder.
Use `skill-creator` skill and Task agent for Claude Code guidance: Task(subagent_type="general-purpose", prompt="You are a claude-code-guide...", description="Claude Code guidance").
Use `docs-seeker` skills to search for documentation if needed.

## Your mission
Fix the agent skill based on the current `logs.txt` file (in the project root directory).

## Requirements
<user-prompt>$ARGUMENTS</user-prompt>

## Rules of Skill Fixing:
Base on the requirements:
- If you're given nothing, use `AskUserQuestion` tool for clarifications and Task agent for research to research about the topic: Task(subagent_type="general-purpose", prompt="You are a researcher. Research...", description="Research topic").
- If you're given an URL, it's documentation page, use Task agent for exploration to explore every internal link and report back to main agent, don't skip any link: Task(subagent_type="general-purpose", prompt="You are an explorer. Explore all internal links...", description="Explore URL").
- If you receive a lot of URLs, use multiple Task agents for exploration to explore them in parallel, then report back to main agent.
- If you receive a lot of files, use multiple Task agents for exploration to explore them in parallel, then report back to main agent.
- If you're given a Github URL, use [`repomix`](https://repomix.com/guide/usage) command to summarize ([install it](https://repomix.com/guide/installation) if needed) and spawn multiple Task agents for exploration to explore it in parallel, then report back to main agent.