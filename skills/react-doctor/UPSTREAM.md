# React Doctor — Upstream Sync Guide

## Source

- Repo: https://github.com/millionco/react-doctor
- NPM: `react-doctor`
- Key files: `install-skill.sh`, `README.md`, `package.json`

## What to Check During Sync

### 1. Version bump
- Check `package.json` → `version` field in cloned repo
- Compare with `upstream-version` in `SKILL.md` frontmatter
- If changed → update frontmatter

### 2. Skill content changes
- Read `install-skill.sh` → find `SKILL_CONTENT` heredoc block
- Compare with our `SKILL.md` body sections
- If they added new instructions → integrate into relevant section

### 3. New rules or categories
- Read `README.md` "How it works" section
- Check if rule count changed (currently 60+)
- Check if new categories added beyond current 8
- Update "Rule Categories" table if changed

### 4. CLI flag changes
- Read `README.md` "Options" section
- Compare with "CLI Flags" table in SKILL.md
- Add/remove/update flags as needed

### 5. Config format changes
- Read `README.md` "Configuration" section
- Compare with "Configuration" section in SKILL.md
- Check for new config keys

### 6. GitHub Actions changes
- Read `README.md` "GitHub Actions" section
- Compare with "GitHub Actions" section in SKILL.md

## What to Preserve (Never Overwrite from Upstream)

- YAML frontmatter: `triggers`, `role`, `scope`, `output-format`
- "When to Use" section (devkit-tailored context)
- "Related Skills" section (devkit-specific references)
- "Workflow" section (devkit-enhanced steps)

## What to Update (From Upstream)

- `upstream-version` in frontmatter
- CLI flags if changed
- Rule categories if new ones added
- Config format if changed
- Quick Start commands if changed
- GitHub Actions usage if changed
- Node.js API if changed

## Update Checklist

1. `npm run sync:upstream` — clones react-doctor repo to temp
2. Check report output for react-doctor section
3. Read cloned files listed in report
4. Compare with current `SKILL.md` using sections above
5. Update `SKILL.md` if changes found
6. Update `upstream-version` in frontmatter
7. `npm run build` — rebuild indexes
8. Verify: `react-doctor` still in `skills-compact.json`
9. Commit and push
