# Phase 2: Rewrite skill/sync.md Command

> Parent: [plan.md](./plan.md)

## Overview
- Date: 2026-02-23
- Priority: P1
- Implementation: Pending
- Review: Pending

## Key Insights
- Current command is 109 lines, workflow: preflight → fetch → evaluate new → copy → build → commit
- Missing: external-skills, rules, updated skills, rollback, auto mode
- AI drives the workflow — script provides data (JSON), AI makes decisions
- Command should work with both `--auto` (fully autonomous) and interactive mode
- AI uses its own tools (Read, Write, Bash) to copy/edit files — more reliable than shell commands

## Requirements
1. Full workflow covering ALL upstream categories (skills, rules, external-skills)
2. Detect and evaluate both NEW and UPDATED items
3. External-skills: read UPSTREAM.md, compare checkFiles, update SKILL.md if needed
4. Rollback on build failure
5. `--auto` flag for fully autonomous operation (no user questions)
6. Cross-platform (AI uses Write tool, not cp -r)

## Architecture

### Command Flow
```
/skill:sync [--auto] [--dry-run]

Step 1: Pre-flight
  ├─ Check git status
  ├─ If dirty + auto mode → git stash
  └─ If dirty + interactive → ask user

Step 2: Fetch & Report
  ├─ Run: node scripts/manual-sync.js --no-branch --json
  └─ Parse JSON output

Step 3: Evaluate Skill Collections (new + updated)
  ├─ For each NEW skill:
  │   ├─ Read SKILL.md from temp dir
  │   ├─ Classify: useful / duplicate / skip
  │   └─ Add to sync list
  ├─ For each UPDATED skill:
  │   ├─ Read both upstream and local SKILL.md
  │   ├─ Summarize what changed
  │   └─ Decide: update / keep local
  └─ Present summary (skip in --auto, sync all useful + updates)

Step 4: Evaluate External Skills
  ├─ For each external skill:
  │   ├─ Read UPSTREAM.md from skills/{name}/
  │   ├─ Read checkFiles from temp dir
  │   ├─ Compare with local SKILL.md
  │   ├─ Check version changes (package.json)
  │   └─ If changes found → update SKILL.md (preserve devkit frontmatter)
  └─ Report what was updated

Step 5: Evaluate Rules
  ├─ For each new rule: read and classify
  └─ Copy useful rules

Step 6: Apply Changes
  ├─ Copy new skills: node scripts/manual-sync.js --copy <name>
  ├─ Update modified skills: AI edits SKILL.md directly
  ├─ Update external skills: AI edits SKILL.md with Write tool
  └─ Copy new rules

Step 7: Rebuild & Verify
  ├─ npm run build
  ├─ If success → proceed
  └─ If fail → git checkout -- . (rollback) + restore stash + report error

Step 8: Commit
  ├─ git add (specific files)
  ├─ git commit -m "feat(skills): sync N new, M updated from upstream"
  └─ Restore stash if was stashed
```

### Evaluation Criteria (for AI)

**New Skills:**
- Useful: covers distinct domain, well-structured SKILL.md, not generic
- Duplicate: similar name/description to existing skill
- Skip: too niche, low quality, just "be a senior X engineer"

**Updated Skills:**
- Accept: upstream adds substantial new content (new sections, patterns, commands)
- Merge: upstream changes some parts but local has customizations worth keeping
- Skip: changes are trivial (formatting only) or local version is superior

**External Skills:**
- Follow UPSTREAM.md guide for what to preserve vs update
- Always update version tracking
- Never overwrite devkit-specific frontmatter

**Rules:**
- Accept: rule covers useful pattern not in existing rules
- Skip: duplicate or too generic

### Auto Mode Behavior
When `--auto` flag:
- Stash dirty workdir automatically
- Sync ALL new useful skills (skip duplicates)
- Accept ALL upstream updates for existing skills
- Update ALL external skills where changes detected
- Accept ALL useful new rules
- Commit automatically
- Restore stash

## Related Code Files
- `commands-claudekit/skill/sync.md` — rewrite target
- `scripts/manual-sync.js` — consumed by command (Phase 1)
- `skills/react-doctor/UPSTREAM.md` — external skill sync guide pattern
- `skills-compact.json` — for duplicate detection

## Implementation Steps

1. Rewrite `commands-claudekit/skill/sync.md` with new workflow
2. Add `$ARGUMENTS` parsing for `--auto`, `--dry-run` flags
3. Write Step 1-8 as clear AI instructions in the command
4. Include evaluation criteria inline
5. Include auto-mode behavior rules
6. Include rollback instructions
7. Include external-skills handling with UPSTREAM.md reference
8. Include rules handling
9. Update `skills/react-doctor/SKILL.md` frontmatter: `upstream-version: latest` → actual version

## Success Criteria
- [ ] `/skill:sync` handles all 3 categories (skills, rules, external-skills)
- [ ] Detects both new AND updated skills
- [ ] External-skills compared using UPSTREAM.md guide
- [ ] `--auto` mode requires zero user interaction
- [ ] `--dry-run` shows report without changes
- [ ] Rollback on build failure
- [ ] Cross-platform (no shell-specific commands)
- [ ] Backward compatible commit message format

## Risk Assessment
- Medium: command complexity increases significantly
- Mitigation: clear step-by-step instructions for AI, not complex logic
- AI evaluation quality depends on context window — 768 skills index is ~71KB, fits easily
- Rollback via `git checkout -- .` is safe for uncommitted changes

## Security Considerations
- Git stash/checkout operations are non-destructive
- No credential handling
- Clone uses HTTPS (public repos)

## Next Steps
After both phases complete: test full workflow with `/skill:sync --auto` on a test branch.
