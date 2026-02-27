---
description: ⚡ Run tests locally and analyze the summary report.
---

Use the `tester` subagent to run tests locally and analyze the summary report.

**IMPORTANT**: **Do not** start implementing.

## Graph-Aware Skill Loading

Before running tests, load relevant skills from `skills-compact.json`:

1. Read `skills-compact.json` → find testing skills matching project framework (by `k` domain field)
2. Check `_recipes` — if task triggers a recipe (e.g., `testing-suite`), load recipe skills
3. Use cascade connections (`e`/`p` fields) to find related testing pattern skills
4. Use loaded skills' test patterns as reference
5. Follow cascade protocol from `auto-skill.md` for weight-aware loading
6. Max 3 additional skills, max 5 total loaded