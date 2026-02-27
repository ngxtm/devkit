---
description: ⚡⚡ Debugging technical issues and providing solutions.
argument-hint: [issues]
---
 
**Reported Issues**:
 $ARGUMENTS

Use the `debugger` subagent to find the root cause of the issues, then analyze and explain the reports to the user.

**IMPORTANT**: **Do not** implement the fix automatically.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing outputs.

## Graph-Aware Skill Loading

Before debugging, load relevant skills from `skills-compact.json`:

1. Read `skills-compact.json` → find reasoning/analysis utility skills by `k` (domain) field
2. Find diagnostic skills matching error domain by `k` field:
   - Frontend errors → find skills with `k` containing "frontend", "browser", "react", etc.
   - API errors → find skills with `k` containing "api", "error-handling"
   - Database errors → find skills with `k` containing "database", "sql", "optimization"
   - Infrastructure → find skills with `k` containing "docker", "kubernetes", "infrastructure"
3. If error mentions specific framework → load that framework's skill via name/keyword match
4. Use cascade connections (`e`/`p` fields) to find related diagnostic skills
5. Optionally load documentation search skill if error pattern is unfamiliar
6. Follow cascade protocol from `auto-skill.md` for weight-aware loading
7. Max 3 additional skills, max 5 total loaded