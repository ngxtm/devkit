# Auto-Skill Detection

> Automatically detect and suggest relevant skills with cascade loading

## When to Activate

Before starting ANY coding task, you SHOULD check if a relevant skill exists:

1. **Analyze the user's request** - Extract key technologies, patterns, or domains
2. **Check compact index** - Read `skills-compact.json` for skill names, categories, and cascade data
3. **Cascade-load** - Auto-load strongly connected skills, suggest moderate ones
4. **Load on-demand** - When user confirms, read full skill from `skills/{name}/SKILL.md`

## Quick Reference: Skill Categories

| Code | Category | Examples |
|------|----------|----------|
| `fe` | Frontend | react, vue, nextjs, tailwind, ui/ux |
| `be` | Backend | node, express, nestjs, fastapi, api |
| `db` | Database | postgres, mysql, mongodb, redis, prisma |
| `ai` | AI/ML | llm, agents, rag, mcp, embeddings |
| `ops` | DevOps | docker, k8s, ci/cd, aws, terraform |
| `test` | Testing | jest, playwright, tdd, e2e |
| `sec` | Security | auth, oauth, jwt, owasp, pentest |
| `git` | Git/Workflow | pr, review, commit, branching |
| `mob` | Mobile | react-native, flutter, ios, android |
| `py` | Python | django, flask, fastapi, pandas |
| `go` | Golang | gin, echo, fiber, concurrency |

## Detection Flow (Cascade-Enhanced)

```
User Request → Extract keywords
                    ↓
          Read skills-compact.json (has cascade fields + recipes)
                    ↓
          Match skill names/descriptions
                    ↓
          Found? → Check _recipes triggers first (priority)
                    ↓
          Recipe matched? → Load recipe skills in workflow order
                    ↓ No
          Get cascade fields for matched skills (e/p/w already in compact)
                    ↓
          Classify by weight: strong (auto-load) / moderate (suggest) / weak (skip)
                    ↓
          Present: "Loading: [primary + strong]. Also available: [moderate]"
                    ↓
          User confirms → Read full SKILL.md for each loaded skill
```

## How to Search

### Step 1: Read Compact Index
```
Read: skills-compact.json
Format: {
  "_categories": {...},
  "_recipes": { "recipe-name": { "triggers": [...], "skills": [...] } },
  "skills": {
    "skill-name": {
      "c": "category",
      "d": "short description",
      "e": ["enhances-skill"],
      "p": ["pairs-with-skill"],
      "w": { "skill-name": "strong|moderate|weak" },
      "k": ["domain", "keywords"]
    }
  }
}
Note: Cascade fields (e/p/w/k) are present for graphed skills. Some skills may lack them.
```

### Step 2: Match by Name/Keyword
Look for skills whose name OR description contains user's keywords:
- User says "react" → find skills with "react" in name
- User says "authentication" → find "auth" skills
- User says "docker" → find "docker" skills

### Step 3: Cascade + Load
After matching, run the Cascade Loading Protocol (see below), then read full SKILL.md for each loaded skill:
```
Read: skills/{skill-name}/SKILL.md
```

## Cascade Loading Protocol

When a skill is matched, use cascade data from `skills-compact.json` (already loaded during keyword detection — no additional file read needed):

### Step 0: Recipe Check (Priority)
Check `_recipes` in `skills-compact.json` (if present). Check if user's keywords match any recipe triggers.
If recipe matched → load ALL recipe skills in workflow order. Skip Steps 1-3.

Present recipe:
```
I found a recipe for your task:

📋 Recipe: [name] — [description]
   1. /skill-a → [role]
   2. /skill-b → [role]
   3. /skill-c → [role]

Load this recipe? (or pick individual skills)
```

### Step 1: Get Cascade Data
Cascade fields are embedded in `skills-compact.json` entries (merged from graph at build time).
If matched skill has no cascade fields (`e`/`p`/`w`), skip cascade (load only primary skill).

### Step 2: Find Connections + Resolve Weights
For each matched skill, get:
- `"e"` (enhances) → check `"w"` map, default `"strong"`
- `"p"` (pairs-with) → check `"w"` map, default `"moderate"`

### Step 3: Determine Cascade
- **Auto-load** (no user confirmation needed):
  - Skills with resolved weight `"strong"`
  - Max 2 auto-loaded skills per primary skill
- **Suggest** (present to user):
  - Skills with resolved weight `"moderate"`
  - Max 3 suggestions total
- **Ignore** (not shown):
  - Skills with resolved weight `"weak"`
- **Total cap**: max 5 skills loaded (primary + cascade combined)

### Step 4: Present
```
I found skills for your task:

📌 Loading: /primary-skill, /connected-skill-1, /connected-skill-2
📎 Also available: /related-skill-1, /related-skill-2

Proceed with loaded skills? (or pick specific ones)
```

### Step 5: Load
When confirmed, read full SKILL.md for each loaded skill.
Order: primary skill first, then strong connections, then moderate if selected.

## Auto-Activate Triggers (Enhanced)

Some patterns should auto-suggest specific skills:

| User says... | Primary Skill | Auto-cascade |
|--------------|---------------|--------------|
| "create PR", "pull request" | /git-advanced-workflows | — |
| "code review" | /code-review | /code-review-checklist |
| "write tests", "add tests" | /test-master | /testing-patterns |
| "fix bug", "debug" | /systematic-debugging | /error-detective |
| "learn", "teach me" | /learn | — |
| "react component" | /react-expert | /react-patterns, /react-state-management |
| "nextjs", "next.js" | /nextjs-best-practices | /react-best-practices |
| "docker", "container" | /docker-expert | — |
| "api design" | /api-design-principles | /api-patterns |
| "database schema" | /database-design | /database-architect |
| "auth" | /auth-implementation-patterns | — |
| "mcp server" | /mcp-developer | /mcp-builder |
| "stripe", "billing" | /stripe-integration | /billing-automation, /payment-integration |

## Important Rules

1. **Strong connections auto-load** — unlike basic mode where all skills require confirmation, cascade auto-loads strong-weight skills alongside the primary. Users can still override or deselect.
2. **Recipe match takes priority** over individual cascade
3. **Max cascade depth: 1 level** — only direct connections, no friend-of-friend
4. **Max total skills per cascade: 5** — recipes can exceed this if needed
5. **Remember context** - If user said "none", don't suggest again for same task
6. **On-demand loading** - Only read full SKILL.md when confirmed (strong auto-loads still wait for the initial "proceed?" confirmation)
7. **No T1 orchestrator cascade** - T1 skills (cook, bootstrap, conductor) have their own loading logic
8. **Quarantined skills excluded** - Already stripped from cascade fields at build time
9. **Weight resolution**: explicit `"w"` map > type-based default (`"e"` → strong, `"p"` → moderate)
10. **Context budget**: cascade reads ZERO additional files (data is in skills-compact.json, already loaded)

## File Locations

| File | Purpose | Size |
|------|---------|------|
| `skills-compact.json` | Quick lookup + cascade data | ~340KB |
| `skills/{name}/SKILL.md` | Full skill content | varies |
| `commands/*.md` | Core commands (pre-loaded) | ~400KB |

## Example Interaction

**User:** "Help me add Stripe billing to my SaaS app"

**Claude:** (reads skills-compact.json, finds "stripe-integration" + cascade data)
```
I found skills for your task:

📌 Loading: /stripe-integration, /payment-integration
📎 Also available: /billing-automation, /api-design-principles

Proceed with loaded skills? (or pick specific ones)
```

**User:** "yes"

**Claude:** (reads SKILL.md for stripe-integration, payment-integration, and applies them)
