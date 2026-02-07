# Auto-Skill Detection

> Automatically detect and suggest relevant skills based on user's task

## When to Activate

Before starting ANY coding task, you SHOULD check if a relevant skill exists:

1. **Analyze the user's request** - Extract key technologies, patterns, or domains
2. **Check compact index** - Read `skills-compact.json` (~20KB) for skill names and categories
3. **Suggest to user** - Present top 1-3 matching skills
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

## Detection Flow

```
User Request → Extract keywords (react, auth, test, etc.)
                    ↓
            Read skills-compact.json
                    ↓
            Match skill names containing keywords
                    ↓
            Found? → Suggest: "I found /skill-name. Use it?"
              ↓ No
            Check category (fe, be, ai, etc.)
                    ↓
            Suggest skills in that category
```

## How to Search

### Step 1: Read Compact Index
```
Read: .claude/skills-compact.json
Format: { "_categories": {...}, "skills": { "skill-name": "category-code" } }
```

### Step 2: Match by Name/Keyword
Look for skills whose name contains user's keywords:
- User says "react" → find skills with "react" in name
- User says "authentication" → find "auth" skills
- User says "docker" → find "docker" skills

### Step 3: Load Full Skill
When user confirms, read the full skill:
```
Read: .claude/skills/{skill-name}/SKILL.md
```

## Suggestion Format

**Single match:**
```
I found a skill that might help:

📌 /skill-name - [category]

Load this skill? It has specialized patterns for your task.
```

**Multiple matches (max 3):**
```
I found skills that might help:

1. /skill-1 - [category]
2. /skill-2 - [category]
3. /skill-3 - [category]

Which one should I use? (or "none" to proceed without)
```

## Auto-Activate Triggers

Some patterns should auto-suggest specific skills:

| User says... | Suggest skill |
|--------------|---------------|
| "create PR", "pull request" | /git-advanced-workflows |
| "code review" | /code-review |
| "write tests", "add tests" | /test-master |
| "fix bug", "debug" | /systematic-debugging |
| "learn", "teach me" | /learn |
| "react component" | /react-expert |
| "nextjs", "next.js" | /nextjs-best-practices |
| "docker", "container" | /docker-expert |
| "api design" | /api-design-principles |
| "database schema" | /database-design |
| "authentication", "auth" | /auth-implementation-patterns |
| "mcp server" | /mcp-developer |

## Important Rules

1. **Don't auto-load** - Always ask before loading a skill
2. **Max 3 suggestions** - Don't overwhelm user
3. **Be concise** - One-line per skill
4. **Remember context** - If user said "none", don't suggest again for same task
5. **On-demand loading** - Only read full SKILL.md when user confirms
6. **Core commands available** - /learn, /react-expert, /docker-expert, etc. are pre-loaded

## File Locations

| File | Purpose | Size |
|------|---------|------|
| `skills-compact.json` | Quick lookup index | ~20KB |
| `skills/{name}/SKILL.md` | Full skill content | varies |
| `commands/*.md` | Core commands (pre-loaded) | ~400KB |

## Example Interaction

**User:** "Help me add JWT authentication to my Express API"

**Claude:** (reads skills-compact.json, finds "auth-implementation-patterns")
```
I found a skill that matches your task:

📌 /auth-implementation-patterns - security

This skill has JWT, OAuth2, and session patterns. Load it?
```

**User:** "yes"

**Claude:** (reads skills/auth-implementation-patterns/SKILL.md and applies it)
