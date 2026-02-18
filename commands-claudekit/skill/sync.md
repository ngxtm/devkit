---
description: Sync new skills from upstream repos with AI evaluation
argument-hint: [options]
---

# Sync Skills from Upstream

> AI-assisted upstream skill sync: fetch, evaluate, select, build.

## Workflow

### Step 1: Pre-flight Check

Verify clean working directory:
```bash
git status --porcelain
```
If not clean → ask user to commit or stash first.

### Step 2: Fetch Upstream

Run the sync script to clone upstream repos and get a report:
```bash
npm run sync:upstream
```

This creates a sync branch and clones repos to temp directory.

### Step 3: Evaluate New Skills

After the script runs, it shows which skills are new. For each **new** skill:

1. Read its `SKILL.md` from the temp directory
2. Evaluate:
   - **Useful**: Skill covers a distinct domain not already well-covered
   - **Duplicate**: Similar skill already exists in the local collection
   - **Irrelevant**: Too niche or low quality

3. Present summary to user:
```
Upstream sync found N new skills:

✅ Useful (X):
  - skill-name: short reason
  - skill-name: short reason

⚠️ Possibly duplicate (Y):
  - skill-name: overlaps with existing-skill

❌ Skip (Z):
  - skill-name: reason

Sync options:
  1. Sync all useful (X skills)
  2. Sync all useful + duplicates (X+Y skills)
  3. Let me choose manually
```

### Step 4: Copy Selected Skills

Use `AskUserQuestion` to get user's choice. Then for selected skills:

```bash
cp -r /tmp/devkit-sync/{source}/{skill-name} ./skills/{skill-name}
```

### Step 5: Rebuild Indexes

```bash
npm run build
```

This regenerates all indexes (merged-commands, rules-index, skills-index, skills-compact).

### Step 6: Review & Commit

Show summary of changes:
```bash
git diff --stat
```

Ask user if they want to commit:
```bash
git add skills/ merged-commands/ SKILLS_INDEX.md skills-index.json skills-compact.json rules-index.json
git commit -m "feat(skills): sync N new skills from upstream"
```

## Options

- `$ARGUMENTS` can specify:
  - `--auto`: Skip evaluation, sync all new skills automatically
  - `--dry-run`: Only show report, don't copy anything
  - A specific upstream name to sync from (e.g., `antigravity` or `agent-assistant`)

## Evaluation Criteria

When evaluating skills, consider:
- Does it cover a technology the project uses or might use?
- Is there already a similar skill? (check by name and description)
- Is the SKILL.md well-structured with actionable content?
- Is it too generic (just says "be a senior X engineer")?

## Important

- **NEVER** auto-sync without user confirmation (unless `--auto` flag)
- **ALWAYS** run `npm run build` after copying skills
- Keep the sync branch for PR review if needed
- The temp directory is at the path shown by the sync script output
