---
description: ⚡⚡⚡ Intelligent plan creation with prompt enhancement
argument-hint: [task]
---

## Your mission
<task>
$ARGUMENTS
</task>

## Pre-Creation Check (Active vs Suggested Plan Detection)

Check the `## Plan Context` section in the injected context:
- If "Plan:" shows a path → Active plan exists. Ask user: "Active plan found: {path}. Continue with this? [Y/n]"
- If "Suggested:" shows a path → Branch-matched plan hint only. Ask user if they want to activate it or create new.
- If "Plan: none" → Proceed to create new plan using naming pattern from `## Naming` section.

## Workflow
- Analyze the given task and use `AskUserQuestion` tool to ask for more details if needed.
- Decide to use `/plan:fast` or `/plan:hard` SlashCommands based on the complexity.
- Execute SlashCommand: `/plan:fast <detailed-instructions-prompt>` or `/plan:hard <detailed-instructions-prompt>`
- Activate `planning` skill.
- Note: `detailed-instructions-prompt` is **an enhanced prompt** that describes the task in detail based on the provided task description.

## Graph-Aware Skill Loading

When creating a plan, load relevant skills from `skills-compact.json`:

1. Extract technology stack from task description
2. Read `skills-compact.json` → find all skills matching stack keywords (by `k` domain field)
3. Check `_recipes` — if task triggers a recipe, use recipe's skill list as reference
4. Load top 3 most relevant domain skills (prefer those with cascade connections via `e`/`p` fields)
5. Use loaded skills' patterns as reference for plan architecture
6. Reference loaded skills in plan steps: "Step 3: Implement auth (see auth-implementation-patterns skill)"
7. Follow cascade protocol from `auto-skill.md` for weight-aware loading
8. Max 3 additional skills, max 5 total loaded

## Important Notes
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** Ensure token efficiency while maintaining high quality.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.
**IMPORTANT**: **Do not** start implementing.
