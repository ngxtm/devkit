# Phase 1: Rewrite manual-sync.js

> Parent: [plan.md](./plan.md)

## Overview
- Date: 2026-02-23
- Priority: P1
- Implementation: Pending
- Review: Pending

## Key Insights
- Current script is 225 lines, does: clean workdir check → create branch → clone → report (text)
- Need to split into: clone utility (always) + optional branch/workdir (flags)
- JSON output enables AI to parse report programmatically instead of reading text
- Hash comparison needed to detect updated skills (not just new ones)
- `fs.cpSync` available since Node.js 16.7 — cross-platform, recursive

## Requirements
1. Add `--no-branch` flag: skip clean workdir check + branch creation
2. Add `--json` flag: output machine-readable JSON report to stdout
3. Add `--copy <skill-name>` flag: cross-platform copy from temp to local
4. Add hash comparison for existing skills (detect updates)
5. Add version extraction for external-skills (read package.json version)
6. Keep backward compatibility: no flags = same behavior as before

## Architecture

### CLI Interface
```
node scripts/manual-sync.js                    # Original behavior (branch + text report)
node scripts/manual-sync.js --no-branch        # Clone + text report, no branch
node scripts/manual-sync.js --no-branch --json # Clone + JSON report (for AI)
node scripts/manual-sync.js --copy react-expert # Copy skill from temp to local
```

### JSON Output Schema
```json
{
  "tempDir": "/tmp/devkit-sync",
  "skills": {
    "new": [
      { "name": "skill-name", "source": "antigravity-awesome-skills", "path": "/tmp/devkit-sync/..." }
    ],
    "updated": [
      { "name": "skill-name", "source": "agent-assistant", "localHash": "abc", "upstreamHash": "def" }
    ],
    "unchanged": 750
  },
  "rules": {
    "new": [...],
    "updated": [...],
    "unchanged": 10
  },
  "external-skills": [
    {
      "name": "react-doctor",
      "localExists": true,
      "upstreamVersion": "1.2.3",
      "localVersion": "latest",
      "checkFiles": [
        { "file": "README.md", "exists": true },
        { "file": "package.json", "exists": true }
      ],
      "tempPath": "/tmp/devkit-sync/react-doctor"
    }
  ]
}
```

### Hash Comparison Logic
```js
const crypto = require('crypto');

function fileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// For each existing skill:
// upstreamHash = fileHash(tempDir/source/skills/name/SKILL.md)
// localHash = fileHash(ROOT_DIR/skills/name/SKILL.md)
// if upstreamHash !== localHash → "updated"
```

### Cross-Platform Copy
```js
// --copy flag handler
function copySkill(skillName, sourceRepo) {
  const src = path.join(TEMP_DIR, sourceRepo, 'skills', skillName);
  const dest = path.join(ROOT_DIR, 'skills', skillName);
  fs.cpSync(src, dest, { recursive: true });
}
```

## Related Code Files
- `scripts/manual-sync.js` — full rewrite target
- `scripts/build-compact-index.js` — called after copy (npm run build)
- `scripts/merge-commands.js` — called after copy (npm run build)

## Implementation Steps

1. Add `crypto` require at top
2. Add CLI arg parsing (--no-branch, --json, --copy)
3. Make `ensureCleanWorkdir()` and `createSyncBranch()` conditional on `--no-branch`
4. Add `fileHash()` function
5. Rewrite `listNewItems()` to also detect updated items via hash comparison
6. Add `getExternalSkillVersion()` — reads package.json from cloned repo
7. Add `copySkill()` — cross-platform copy using `fs.cpSync`
8. Add JSON output mode in `showReport()` — output `JSON.stringify(report)` to stdout
9. Keep text output as default for backward compatibility
10. Test: `node scripts/manual-sync.js --no-branch --json` outputs valid JSON

## Success Criteria
- [ ] `--no-branch` skips branch creation and workdir check
- [ ] `--json` outputs machine-readable JSON to stdout
- [ ] `--copy <name>` copies skill cross-platform
- [ ] Updated skills detected via hash comparison
- [ ] External-skills include upstream version from package.json
- [ ] No flags = original behavior preserved
- [ ] Works on Windows (no `cp -r`, uses `fs.cpSync`)

## Risk Assessment
- Low: additive changes, backward compatible
- Hash comparison adds ~100ms for 768 skills (acceptable)
- `fs.cpSync` requires Node.js 16.7+ (check user's Node version)

## Next Steps
After this phase, Phase 2 rewrites the command to consume JSON output.
