# Phase 3: Create Update Workflow Guide

> Parent: [plan.md](./plan.md)

## Overview
- Date: 2026-02-23
- Priority: P2
- Implementation: Pending
- Review: Pending

## Key Insights
- User syncs every 1-2 weeks manually using AI locally, then pushes
- Workflow needs to be AI-readable — a guide that AI can follow during sync sessions
- Co-locate with skill at `skills/react-doctor/UPSTREAM.md` for discoverability
- Should be reusable pattern for future external skills

## Target File
`skills/react-doctor/UPSTREAM.md`

## Content Structure

```markdown
# React Doctor — Upstream Sync Guide

## Source
- Repo: https://github.com/millionco/react-doctor
- NPM: react-doctor
- Key files: install-skill.sh, README.md, package.json

## What to Check During Sync

### 1. Version bump
- Check `package.json` version in cloned repo
- Compare with `upstream-version` in SKILL.md frontmatter

### 2. Skill content changes
- Read `install-skill.sh` → find SKILL_CONTENT heredoc
- Compare with our SKILL.md body
- If they added new instructions, integrate them

### 3. New rules or categories
- Read README.md "How it works" section
- Check if rule count changed (currently 60+)
- Check if new categories added

### 4. CLI flag changes
- Read README.md "Options" section
- Compare with our CLI Flags section

### 5. Config format changes
- Read README.md "Configuration" section
- Compare with our Configuration section

## What to Preserve (Never Overwrite)
- YAML frontmatter (devkit-specific: triggers, role, scope, output-format)
- "When to Use" section (devkit-tailored)
- "Integration with Other Skills" section
- "Workflow" section (devkit-enhanced)

## What to Update (From Upstream)
- Version number in frontmatter
- CLI flags if changed
- Rule categories if new ones added
- Config format if changed
- Quick Start command if changed

## Update Checklist
1. Run `npm run sync:upstream`
2. Check cloned repo at temp dir
3. Compare key files (see above)
4. Update SKILL.md if needed
5. Run `npm run build` to rebuild indexes
6. Verify: react-doctor still in skills-compact.json
7. Commit and push
```

## Implementation Steps

1. Create `skills/react-doctor/UPSTREAM.md` with sync guide content
2. Ensure content is concise and actionable for AI during sync sessions

## Success Criteria
- [ ] `UPSTREAM.md` exists and documents the sync workflow
- [ ] Guide is actionable by AI (clear comparison steps)
- [ ] Preservation rules clearly stated (what to keep vs update)
- [ ] Checklist format for quick reference

## Security Considerations
- None — this is a documentation file
- No secrets or credentials involved
