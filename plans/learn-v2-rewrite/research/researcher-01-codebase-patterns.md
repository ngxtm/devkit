# Research: Codebase Patterns for /learn Rewrite

## Command Size Comparison
| Command | Lines | Pattern |
|---------|-------|---------|
| debug.md | 12 | Ultra-minimal, delegates to skill |
| plan.md | 30 | Short, references subagents |
| fix.md | 42 | Routing + delegation |
| cook.md | 104 | Full workflow with subagents |
| code.md | 205 | Detailed with step-by-step |
| **learn.md** | **477** | **Bloated, needs 50%+ reduction** |

## Key Pattern: cook.md Structure
- YAML frontmatter with description + argument-hint
- Role responsibilities section (brief)
- Workflow with phases (Research → Plan → Implement → Test → Review)
- Uses subagents for parallel work
- References skills catalog dynamically

## Existing Adaptive System: coding-level.md
- 6 levels (0=ELI5 to 5=GodMode)
- Stored in `.claude/.ck.json` as `codingLevel`
- Auto-injected per session
- **learn.md should integrate with this instead of creating own difficulty system**

## Language Detection (cli/detect.js)
Supported: flutter, react, nextjs, nestjs, golang, python, rust, java/kotlin, typescript, prisma, supabase, vue, angular, svelte, express, fastify, hono, tailwind, docker

**Missing from learn.md's table:** Flutter/Dart, Kotlin, Vue, Angular, Svelte, Unity C#

## Templates Available
base, dart, flutter, golang, java, javascript, nestjs, nextjs, react, rust, typescript

## Skills That Could Be Activated During Learn
- `systematic-debugging` - for debug exercises
- `test-master` - for test-writing steps
- `coding-level` - for adaptive difficulty
- Language-specific skills (react-expert, python-pro, etc.)

## Unresolved
- No existing resume/progress pattern found in codebase
- No WebSearch usage found in any core command
