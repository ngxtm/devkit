# Phase 2: Add Upstream Sync Config

> Parent: [plan.md](./plan.md)

## Overview
- Date: 2026-02-23
- Priority: P2
- Implementation: Pending
- Review: Pending

## Key Insights
- `manual-sync.js` UPSTREAMS has 2 categories: `skills` (skill collections) and `rules`
- Each entry: `{ name, repo, path }` — `path` is the subdirectory containing items
- react-doctor is NOT a skill collection — it's a single repo with one skill embedded
- Need a new category `external-skills` for this type of source
- Sync doesn't auto-merge — it clones to temp and shows report. User + AI decide what to update.

## Target File
`scripts/manual-sync.js` — modify UPSTREAMS config (line 19-38)

## Changes Required

### 1. Add `external-skills` to UPSTREAMS

```js
const UPSTREAMS = {
  skills: [
    // ...existing...
  ],
  rules: [
    // ...existing...
  ],
  // NEW: Individual skills from external repos
  'external-skills': [
    {
      name: 'react-doctor',
      repo: 'https://github.com/millionco/react-doctor.git',
      // Files to check for upstream changes
      checkFiles: ['install-skill.sh', 'README.md', 'package.json']
    }
  ]
};
```

### 2. Update `cloneUpstreams()` function

Add handling for `external-skills` category — same clone logic, but report shows differently (per-file diff instead of per-skill-directory).

### 3. Update `listNewItems()` function

For external-skills, compare `checkFiles` content instead of listing subdirectories.

### 4. Update `showReport()` function

Show external-skills section in report:
```
📁 EXTERNAL-SKILLS:
   react-doctor:
   Upstream files to review:
     - install-skill.sh (SKILL_CONTENT heredoc)
     - README.md (CLI docs, config reference)
     - package.json (version)
   Local skill: skills/react-doctor/SKILL.md
   Compare and update if needed.
```

## Related Code Files
- `scripts/manual-sync.js:19-38` — UPSTREAMS config
- `scripts/manual-sync.js:87-112` — cloneUpstreams()
- `scripts/manual-sync.js:114-130` — listNewItems()
- `scripts/manual-sync.js:132-165` — showReport()

## Implementation Steps

1. Add `external-skills` array to UPSTREAMS constant
2. Update `cloneUpstreams()` to handle new category (clone logic is same)
3. Update `showReport()` to display external-skills with file-level comparison guidance
4. Test: `npm run sync:upstream` should clone react-doctor repo and show in report

## Success Criteria
- [ ] `UPSTREAMS` has `external-skills` category with react-doctor entry
- [ ] `npm run sync:upstream` clones react-doctor repo to temp
- [ ] Report shows react-doctor with files to review
- [ ] Existing skills/rules sync not broken

## Risk Assessment
- Low risk: UPSTREAMS is just config, clone logic is generic
- `external-skills` is additive — doesn't change existing behavior
- Only modifying report display, not merge logic
