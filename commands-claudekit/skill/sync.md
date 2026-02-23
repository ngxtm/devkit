---
description: Sync skills, rules, and external-skills from upstream repos with AI evaluation
argument-hint: [--auto] [--dry-run]
---

# Sync from Upstream

> AI-driven upstream sync: fetch, evaluate new+updated skills/rules/external-skills, apply, build, commit.

## Arguments

Parse `$ARGUMENTS` for flags:
- `--auto`: Fully autonomous — sync all useful new items, accept all updates, no user questions
- `--dry-run`: Show report only, don't copy or commit anything

## Workflow

### Step 1: Pre-flight

Check git status:
```bash
git status --porcelain
```

- If **clean** → proceed
- If **dirty + `--auto`** → run `git stash push -m "devkit-sync-stash"`
- If **dirty + interactive** → ask user to commit/stash or continue with stash

Remember if stash was created (for restore later).

### Step 2: Fetch & Report

Run the sync script with JSON output:
```bash
node scripts/manual-sync.js --no-branch --json
```

Parse the JSON output. It contains:
```json
{
  "tempDir": "/tmp/devkit-sync",
  "skills": { "new": [...], "updated": [...], "unchanged": N },
  "rules": { "new": [...], "updated": [...], "unchanged": N },
  "external-skills": [{ "name": "...", "localExists": bool, "upstreamVersion": "...", "localVersion": "...", "checkFiles": [...], "tempPath": "..." }]
}
```

If all categories have 0 new and 0 updated → report "Already up to date" and stop.

### Step 3: Evaluate New Skills

For each item in `skills.new`:
1. Read its `SKILL.md` from the `path` field in the report
2. Classify:
   - **Useful**: Covers a distinct domain, well-structured, actionable content
   - **Duplicate**: Similar skill already exists (check by name/description against skills-compact.json)
   - **Skip**: Too niche, low quality, or just "be a senior X engineer" with no real content
3. In `--auto` mode: sync all useful, skip duplicates and low quality
4. In interactive mode: present summary and ask user using `AskUserQuestion`

Summary format:
```
Upstream sync found N new skills:

✅ Useful (X): skill-a, skill-b, ...
⚠️ Duplicate (Y): skill-c (overlaps existing-skill), ...
❌ Skip (Z): skill-d (reason), ...
```

### Step 3.5: Evaluate Updated Skills

For each item in `skills.updated`:
1. Read **both** upstream SKILL.md (from tempDir) and local SKILL.md
2. Compare and summarize what changed
3. Classify:
   - **Accept**: Upstream adds substantial new content (new sections, patterns, commands)
   - **Skip**: Changes are trivial (formatting only) or local version is superior/customized
4. In `--auto` mode: accept all non-trivial updates
5. In interactive mode: present changes summary and ask user

### Step 4: Evaluate External Skills

For each item in `external-skills`:
1. Check if local skill exists (`localExists` field)
2. If exists:
   a. Read `UPSTREAM.md` from `skills/{name}/UPSTREAM.md` for sync guide
   b. Read the relevant `checkFiles` from `tempPath` in the report
   c. Compare with local `SKILL.md`
   d. Check version: if `upstreamVersion` differs from `localVersion` → needs update
   e. Follow UPSTREAM.md guide: preserve devkit-specific sections, update upstream-derived content
   f. Update `upstream-version` in SKILL.md frontmatter to `upstreamVersion` value
3. If not exists: report it as available but don't auto-create (manual setup needed)
4. In `--auto` mode: apply all detected changes following UPSTREAM.md rules
5. In interactive mode: show what changed and ask user

### Step 5: Evaluate Rules

For each item in `rules.new`:
1. Read the rule content from `path` field
2. Classify: useful (covers new pattern) or skip (duplicate/too generic)
3. In `--auto` mode: sync all useful
4. In interactive mode: ask user

For each item in `rules.updated`:
1. Compare upstream and local content
2. Accept meaningful updates, skip trivial ones

### Step 6: Apply Changes

If `--dry-run` → skip this step, just show what would be done.

For selected items:
- **New skills**: `node scripts/manual-sync.js --copy <name>` for each
- **Updated skills**: Read upstream SKILL.md, use Write tool to update local SKILL.md (preserve local customizations if any)
- **New rules**: `node scripts/manual-sync.js --copy <name>` for each
- **Updated rules**: Use Write tool to update local rule files
- **External skills**: Use Write tool to edit SKILL.md following UPSTREAM.md guide

### Step 7: Rebuild & Verify

```bash
npm run build
```

- If **success** → proceed to commit
- If **failure** → rollback ALL changes:
  ```bash
  git checkout -- .
  ```
  If stash was created: `git stash pop`
  Report the build error and stop.

### Step 8: Commit

Stage and commit the changes:
```bash
git add skills/ rules/ merged-commands/ SKILLS_INDEX.md skills-index.json skills-compact.json rules-index.json
```

Commit message format:
```
feat(skills): sync N new, M updated skills from upstream
```

Adjust the message based on what was actually synced (skills, rules, external-skills).

If stash was created earlier: `git stash pop` to restore user's changes.

## Evaluation Criteria

### New Skills
- **Useful**: Covers distinct domain, well-structured SKILL.md, actionable patterns/commands
- **Duplicate**: Similar name or description to existing skill in skills-compact.json
- **Skip**: Too niche, low quality, just "be a senior X engineer" boilerplate

### Updated Skills
- **Accept**: Upstream adds substantial new content (new sections, patterns, examples)
- **Skip**: Changes are trivial (whitespace, formatting) or local version is customized and superior

### External Skills
- Follow UPSTREAM.md guide in each skill directory
- Always update version tracking
- Never overwrite devkit-specific frontmatter (`triggers`, `role`, `scope`, `output-format`)

### Rules
- **Accept**: Rule covers useful pattern not in existing rules
- **Skip**: Duplicate or too generic

## Important

- In interactive mode, **ALWAYS** ask before applying changes
- In `--auto` mode, proceed fully autonomously
- **ALWAYS** run `npm run build` after applying changes
- **ALWAYS** rollback on build failure via `git checkout -- .`
- Use `node scripts/manual-sync.js --copy` or Write tool for file operations — **NEVER** use `cp -r` (Windows incompatible)
- The temp directory path is in the JSON report's `tempDir` field
