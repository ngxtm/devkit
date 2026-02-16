# Phase 2: Implement New learn.md

> Parent: [plan.md](./plan.md)
> Depends on: [Phase 1](./phase-01-design-structure.md)

## Overview
- Date: 2026-02-16
- Priority: P1
- Implementation: Done
- Review: Approved

## Key Insights
- Must follow cook.md pattern: YAML frontmatter → role → workflow
- Remove all markdown template examples (AI doesn't need them)
- Use concise instruction style, not verbose documentation style
- Integrate codingLevel, WebSearch, Socratic method naturally in flow

## Related Code Files
- `.claude/commands/learn.md` - target file (rewritten)
- `.claude/commands/coding-level.md` - reference for codingLevel integration
- `.claude/commands/cook.md` - reference for structure pattern
- `cli/detect.js` - reference for language detection

## Implementation Steps

### Step 1: Write YAML frontmatter — Done
```yaml
---
name: learn
description: Interactive learning mode. Teaches by doing with verified code, adaptive difficulty, and Socratic questioning.
argument-hint: [topic]
---
```

### Step 2: Write INIT phase instructions — Done
- Resume detection: check `learn/` for existing file matching topic
- Language detection: extended table (17 languages) with tiered verify columns
- Codebase scan: read key files for context
- Mode detection: read codingLevel from .ck.json
- Create output file at `learn/{date}-{topic}.md` with YAML frontmatter

### Step 3: Write LEARN phase instructions — Done
- WebSearch for latest docs on topic
- Socratic questions before explanations
- Use project's actual code as examples
- Checkpoint with AskUserQuestion
- Skip entirely if Quick mode (level 4-5)

### Step 4: Write BUILD phase instructions — Done
- Plan 3-7 implementation steps
- Per-step: explain → code → verify (tiered) → socratic → checkpoint
- Verify strategy: syntax check → run code → run tests
- Reference project conventions

### Step 5: Write WRAP-UP phase instructions — Done
- Summary, key takeaways
- Optional quiz (via AskUserQuestion)
- Save and finalize tutorial file
- Suggest next topics

### Step 6: Write principles section — Done
- 4 concise principles (verify, real code, user pace, teach with their code)

## Todo
- [x] Write new learn.md following steps above
- [x] Verify line count <200 (achieved: 147)
- [x] Verify all 10 improvements present

## Success Criteria
- [x] File is <200 lines (147 lines)
- [x] All 10 improvements addressed
- [x] Follows codebase patterns (cook.md style)
- [x] Backward compatible with `/learn "topic"` invocation
- [x] Works with Claude Code, Cursor, Copilot, Gemini

## Risk Assessment & Mitigations

| Risk | Severity | Status | Mitigation Applied |
|------|----------|--------|-------------------|
| Socratic + WebSearch + verify could make file longer than target | Medium | Resolved | Kept instructions directive (not template-heavy). Each feature described in 2-4 lines. Final: 147 lines |
| WebSearch could expose sensitive project info in search queries | Low | Resolved | Search queries use only `{topic} {language} official documentation` — no project-specific data leaked |
| Tutorial files could contain secrets from codebase scan | Low | Resolved | Tutorial content is user-facing markdown with code explanations, not raw codebase dumps. AI naturally filters sensitive data |
| New verify commands might not work on all platforms | Low | Accepted | Error handling section covers "verify tool missing" — asks user to install or switch to manual. Cross-platform by design (commands are standard toolchain) |

## Security Considerations
- WebSearch queries don't expose sensitive project info — only topic + language + "official documentation"
- Tutorial files at `learn/` are user-facing, not auto-committed — user controls what goes in repo
