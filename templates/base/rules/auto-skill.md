# Auto-Skill Detection

> Automatically detect and suggest relevant skills based on user's task

## When to Activate

Before starting ANY coding task, you MUST check if a relevant skill exists:

1. **Analyze the user's request** - Extract key technologies, patterns, or domains
2. **Quick keyword match** - Check `skills-keywords.json` for exact matches
3. **Category browse** - If no exact match, check `skills-categories.json` for relevant category
4. **Suggest to user** - Present top 1-3 matching skills with brief descriptions

## Detection Flow

```
User Request → Extract Keywords → Match in skills-keywords.json
                                          ↓
                              Found? → Suggest: "I found /skill-name that matches your task"
                                ↓ No
                         Check skills-categories.json → Browse category
                                          ↓
                              Found? → Suggest: "These skills in [category] might help: ..."
                                ↓ No
                         Proceed without skill
```

## How to Search

### Step 1: Extract Keywords
From user request, identify:
- **Technologies**: react, python, docker, postgres, etc.
- **Patterns**: authentication, caching, testing, deployment
- **Domains**: ai, security, mobile, devops

### Step 2: Keyword Lookup
```
Read: .claude/skills-keywords.json
Find: keywords from user request
Result: List of matching skill names
```

### Step 3: Category Fallback
If keywords don't match, check categories:
- `frontend` - React, Vue, UI/UX, CSS
- `backend` - Node, API, REST, GraphQL
- `database` - SQL, Postgres, MongoDB, Redis
- `ai-ml` - LLM, Agents, RAG, Embeddings
- `devops` - Docker, K8s, CI/CD, Cloud
- `testing` - Jest, Playwright, TDD
- `security` - Auth, OAuth, OWASP
- `mobile` - React Native, Flutter, iOS
- `git-workflow` - PR, Code Review, Branching

### Step 4: Suggest

**Format for suggestion:**
```
I found a skill that might help with your task:

📌 /skill-name - Brief description

Would you like me to use this skill? (It will load specific patterns and best practices for [domain])
```

**For multiple matches:**
```
I found several skills that might help:

1. /skill-1 - Description
2. /skill-2 - Description
3. /skill-3 - Description

Which one should I use? (or say "none" to proceed without)
```

## Auto-Activate Triggers

Some skills should auto-activate based on patterns:

| Pattern | Auto-load Skill |
|---------|----------------|
| "create PR", "pull request" | /pr-description |
| "code review" | /code-review |
| "write tests", "add tests" | /test-master |
| "fix bug", "debug" | /systematic-debugging |
| "deploy", "deployment" | Check devops category |
| "authenticate", "auth" | /auth-patterns |
| "database schema" | /database-design |

## Important Rules

1. **Don't overwhelm** - Max 3 suggestions at a time
2. **Be concise** - One-line descriptions only
3. **Ask permission** - Always ask before loading a skill
4. **Remember context** - If user said "none", don't suggest again for same task
5. **Skill stacking** - Multiple skills can be used together if relevant

## Files Reference

| File | Purpose | Size |
|------|---------|------|
| `skills-keywords.json` | Keyword → Skills mapping | ~330KB |
| `skills-categories.json` | Category-based index | ~108KB |
| `skills-triggers.json` | Trigger patterns | ~205KB |
| `skills-index.json` | Full skill list | ~200KB |

## Example Interactions

**User:** "Add JWT authentication to my Express API"

**Claude:**
```
I found skills that match your task:

📌 /auth-patterns - JWT, OAuth2, session management patterns
📌 /express-expert - Express.js best practices and middleware

Should I use these? They'll help ensure secure auth implementation.
```

**User:** "Optimize my React app performance"

**Claude:**
```
I found a relevant skill:

📌 /react-performance - React optimization patterns, memo, lazy loading, profiling

Want me to apply these optimization patterns?
```
