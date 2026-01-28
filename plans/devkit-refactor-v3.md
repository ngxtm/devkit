# Devkit Refactor v3 - Implementation Plan

> **Status**: COMPLETED - 2026-01-28
> **Goal**: Refactor devkit to be lightweight, per-project, with smart rule injection based on detected tech stack.

## Problem Statement

Current devkit has these issues:
1. **Context limit crash**: `devkit install` copies ~59MB globally → Claude crashes
2. **No smart rules**: All 327+ rules installed regardless of project type
3. **Command conflicts**: `commands/` and `commands-claudekit/` have overlapping names
4. **No version tracking**: Can't track which source versions are installed

## Architecture Overview

### New Approach

```
┌─────────────────────────────────────────────────────────────────┐
│                        devkit init                               │
│                            │                                     │
│                            ▼                                     │
│    ┌──────────────────────────────────────────────────────┐     │
│    │              Project Detection                        │     │
│    │  - package.json → React/Next.js/NestJS               │     │
│    │  - pubspec.yaml → Flutter                            │     │
│    │  - go.mod → Golang                                   │     │
│    │  - pyproject.toml → Python                           │     │
│    └──────────────────────────────────────────────────────┘     │
│                            │                                     │
│                            ▼                                     │
│    ┌──────────────────────────────────────────────────────┐     │
│    │           Install ONLY Relevant Content               │     │
│    │  - Merged commands (~150KB)                          │     │
│    │  - Tech-specific rules (~50-200KB)                   │     │
│    │  - Skills index only (~30KB)                         │     │
│    │  - Essential hooks (~30KB)                           │     │
│    └──────────────────────────────────────────────────────┘     │
│                            │                                     │
│                            ▼                                     │
│              .claude/ folder (~300-500KB total)                  │
│              vs. old approach (~59MB)                            │
└─────────────────────────────────────────────────────────────────┘
```

### Sources Integration

| Source | Content | Usage |
|--------|---------|-------|
| agent-assistant | 20 agents, 40 commands | Merge commands, embed agent knowledge |
| claudekit | 90+ commands, hooks, workflows | Prefer for sophisticated commands |
| antigravity | 411 skills | Index only, load on-demand |
| skill-rule | 327 rules (Flutter/Go/Node/Python/React) | Install based on detection |

---

## Implementation Phases

### Phase 1: CLI Refactoring

**Goal**: Remove `devkit install`, make `devkit init` the primary command.

#### 1.1 Update `cli/index.js`

```javascript
// REMOVE these commands:
// - install (global installation)
// - uninstall (global removal)

// KEEP these commands:
const commands = {
  init: (options) => initProject(options),      // PRIMARY
  update: (options) => updateProject(options),  // Re-run detection + update
  detect: () => detectProjectType(),            // Show detected tech stack
  list: () => listSkills(),                     // List available skills
  help: () => showHelp(),
  version: () => console.log(`v${VERSION}`),
};
```

#### 1.2 Create `cli/detect.js` - Project Detection

```javascript
const DETECTION_RULES = {
  flutter: {
    files: ['pubspec.yaml'],
    rules: ['flutter', 'dart']
  },
  react: {
    dependencies: ['react', 'react-dom'],
    rules: ['react', 'javascript', 'typescript']
  },
  nextjs: {
    files: ['next.config.js', 'next.config.mjs', 'next.config.ts'],
    rules: ['nextjs', 'react', 'typescript']
  },
  nestjs: {
    files: ['nest-cli.json'],
    dependencies: ['@nestjs/core'],
    rules: ['nestjs', 'typescript']
  },
  golang: {
    files: ['go.mod'],
    rules: ['golang']
  },
  python: {
    files: ['pyproject.toml', 'requirements.txt', 'Pipfile'],
    rules: ['python']
  },
  prisma: {
    files: ['prisma/schema.prisma'],
    rules: ['prisma']
  },
  supabase: {
    files: ['supabase/config.toml'],
    dependencies: ['@supabase/supabase-js'],
    rules: ['supabase']
  }
};
```

---

### Phase 2: Active Rules Injection

**Goal**: Install only rules relevant to detected tech stack.

#### 2.1 Reorganize Rules Structure

```
templates/
├── base/                    # Always installed
│   ├── commands/            # Core merged commands
│   └── hooks/               # Essential hooks
│
├── flutter/
│   └── rules/               # From rules/flutter/*
│       ├── bloc-state-management/
│       ├── riverpod-state-management/
│       └── ...
│
├── react/
│   └── rules/               # From rules/react/*
│       ├── core-react/
│       ├── react-query/
│       └── ...
│
├── nextjs/
│   └── rules/               # From rules/nextjs/*
│
├── nestjs/
│   └── rules/               # From rules/nestjs/*
│
├── golang/
│   └── rules/               # From rules/golang/*
│
├── python/
│   └── rules/               # From rules/python/*
│
└── typescript/
    └── rules/               # From rules/typescript/*
```

#### 2.2 Update `initProject()` Logic

```javascript
function initProject(options = {}) {
  const projectDir = options.path || process.cwd();
  const claudeDir = path.join(projectDir, '.claude');

  // 1. Detect project type
  const detected = detectProjectType(projectDir);
  console.log(`Detected: ${detected.join(', ') || 'generic'}`);

  // 2. Install base (always)
  copyDir(templates/base/commands, .claude/commands);
  copyDir(templates/base/hooks, .claude/hooks);

  // 3. Install only relevant rules
  for (const type of detected) {
    if (fs.existsSync(`templates/${type}/rules`)) {
      copyDir(`templates/${type}/rules`, `.claude/rules/${type}`);
    }
  }

  // 4. Install skills index (not full skills)
  copyFile('skills-index.json', '.claude/skills-index.json');

  // 5. Create tracking file
  writeJson('.claude/devkit.json', {
    version: VERSION,
    detected,
    installedAt: new Date().toISOString()
  });
}
```

---

### Phase 3: Command Merging Strategy

**Goal**: Merge `commands/` and `commands-claudekit/` intelligently.

#### 3.1 Conflict Resolution

| Command | agent-assistant | claudekit | Resolution |
|---------|-----------------|-----------|------------|
| `/plan` | Basic | Has: parallel, two, archive, ci, cro | **Use claudekit** |
| `/fix` | Has: fast, hard | Has: ci, logs, ui, test, types, parallel | **Merge both** |
| `/cook` | Has: fast, hard | Has: auto, auto/fast, auto/parallel | **Merge both** |
| `/code` | Has: fast, hard | Has: auto, parallel, no-test | **Merge both** |
| `/test` | Has: fast, hard | Has: ui | **Merge both** |
| `/brainstorm` | Has: fast, hard | Basic | **Merge both** |
| `/design` | Has: fast, hard | Has: 3d, screenshot, video, describe | **Merge both** |
| `/docs` | Has: audit, business, core | Has: init, update, summarize | **Merge both** |
| `/review` | Has: fast, hard | Has: codebase, codebase/parallel | **Merge both** |

#### 3.2 Merged Commands Structure

```
merged-commands/
├── ask.md                    # From claudekit
├── bootstrap.md              # From claudekit only
├── bootstrap/
│   ├── auto.md
│   └── auto/
│       ├── fast.md
│       └── parallel.md
├── brainstorm.md             # Claudekit (simpler)
├── brainstorm/
│   ├── fast.md               # Agent-assistant
│   └── hard.md               # Agent-assistant
├── code.md                   # Merged
├── code/
│   ├── auto.md               # Claudekit
│   ├── fast.md               # Agent-assistant
│   ├── hard.md               # Agent-assistant
│   ├── no-test.md            # Claudekit
│   └── parallel.md           # Claudekit
├── cook.md                   # Merged
├── cook/
│   ├── auto.md               # Claudekit
│   ├── auto/
│   │   ├── fast.md           # Claudekit
│   │   └── parallel.md       # Claudekit
│   ├── fast.md               # Agent-assistant
│   └── hard.md               # Agent-assistant
├── debug.md                  # Claudekit
├── deploy.md                 # Agent-assistant only
├── deploy/
│   ├── check.md
│   ├── preview.md
│   ├── production.md
│   └── rollback.md
├── design.md                 # Merged
├── design/
│   ├── 3d.md                 # Claudekit
│   ├── describe.md           # Claudekit
│   ├── fast.md               # Agent-assistant
│   ├── good.md               # Claudekit
│   ├── hard.md               # Agent-assistant
│   ├── screenshot.md         # Claudekit
│   └── video.md              # Claudekit
├── docs.md                   # Merged
├── docs/
│   ├── audit.md              # Agent-assistant
│   ├── business.md           # Agent-assistant
│   ├── core.md               # Agent-assistant
│   ├── init.md               # Claudekit
│   ├── summarize.md          # Claudekit
│   └── update.md             # Claudekit
├── fix.md                    # Merged
├── fix/
│   ├── ci.md                 # Claudekit
│   ├── fast.md               # Agent-assistant
│   ├── hard.md               # Both (use claudekit)
│   ├── logs.md               # Claudekit
│   ├── parallel.md           # Claudekit
│   ├── test.md               # Claudekit
│   ├── types.md              # Claudekit
│   └── ui.md                 # Claudekit
├── git/                      # Claudekit only
│   ├── cm.md
│   ├── cp.md
│   ├── merge.md
│   └── pr.md
├── integrate/                # Claudekit only
│   ├── polar.md
│   └── sepay.md
├── journal.md                # Claudekit
├── kanban.md                 # Claudekit
├── plan.md                   # Claudekit (more complete)
├── plan/
│   ├── archive.md            # Claudekit
│   ├── ci.md                 # Claudekit
│   ├── cro.md                # Claudekit
│   ├── fast.md               # Both (merge)
│   ├── hard.md               # Both (merge)
│   ├── parallel.md           # Claudekit
│   ├── two.md                # Claudekit
│   └── validate.md           # Claudekit
├── review.md                 # Agent-assistant
├── review/
│   ├── codebase.md           # Claudekit
│   ├── codebase/
│   │   └── parallel.md       # Claudekit
│   ├── fast.md               # Agent-assistant
│   └── hard.md               # Agent-assistant
├── scout.md                  # Claudekit
├── scout/
│   └── ext.md                # Claudekit
├── skill/                    # Claudekit only
│   ├── add.md
│   ├── create.md
│   ├── fix-logs.md
│   ├── optimize.md
│   ├── optimize/
│   │   └── auto.md
│   ├── plan.md
│   └── update.md
├── test.md                   # Merged
├── test/
│   ├── fast.md               # Agent-assistant
│   ├── hard.md               # Agent-assistant
│   └── ui.md                 # Claudekit
├── watzup.md                 # Claudekit
└── worktree.md               # Claudekit
```

---

### Phase 4: On-Demand Skills Loading

**Goal**: Don't install 411 skills, just provide index for on-demand loading.

#### 4.1 Enhanced skills-index.json

```json
{
  "version": "1.0.0",
  "total": 411,
  "source": "https://unpkg.com/@ngxtm/devkit@latest/skills/",
  "skills": [
    {
      "name": "react-best-practices",
      "category": "frontend",
      "tags": ["react", "hooks", "typescript"],
      "description": "Modern React patterns with hooks, context, and performance optimization",
      "files": ["SKILL.md"],
      "size": "12KB"
    }
  ],
  "categories": {
    "frontend": ["react-best-practices", "nextjs-developer", "vue-expert"],
    "backend": ["nodejs-best-practices", "nestjs-expert", "fastapi-expert"],
    "database": ["postgres-best-practices", "prisma-expert"],
    "ai": ["mcp-management", "langgraph", "prompt-engineering"],
    "devops": ["docker-expert", "kubernetes-specialist", "terraform-engineer"]
  }
}
```

#### 4.2 Skills Loading Protocol (in CLAUDE.md)

```markdown
## Skills Loading

When you need a specific skill:

1. Check `.claude/skills-index.json` for skill existence
2. Fetch skill content:
   - Online: `https://unpkg.com/@ngxtm/devkit@latest/skills/{name}/SKILL.md`
   - Local: User runs `devkit load {skill-name}`
3. Apply skill knowledge to current task
```

---

### Phase 5: Update Mechanism

#### 5.1 `devkit update` Command

```javascript
function updateProject(options = {}) {
  const configPath = '.claude/devkit.json';

  if (!fs.existsSync(configPath)) {
    console.log('No devkit installation. Run: devkit init');
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath));

  // Re-run detection (project may have changed)
  const newDetected = detectProjectType(process.cwd());

  // Check for added tech stacks
  const added = newDetected.filter(t => !config.detected.includes(t));
  const removed = config.detected.filter(t => !newDetected.includes(t));

  if (added.length > 0) {
    console.log(`New tech detected: ${added.join(', ')}`);
    // Install new rules
  }

  if (removed.length > 0) {
    console.log(`Removed: ${removed.join(', ')}`);
    // Optionally clean up old rules
  }

  // Update tracking
  config.detected = newDetected;
  config.updatedAt = new Date().toISOString();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
```

---

### Phase 6: File Structure After Refactor

#### Package Root (npm package)

```
@ngxtm/devkit/
├── cli/
│   ├── index.js              # CLI entry (simplified)
│   ├── init.js               # Per-project init
│   ├── detect.js             # Project detection
│   ├── update.js             # Update mechanism
│   └── config.js             # Configuration
│
├── merged-commands/          # Pre-merged commands
│   └── ... (as above)
│
├── templates/
│   ├── base/
│   │   ├── commands/         # Symlink to merged-commands
│   │   └── hooks/
│   ├── flutter/rules/
│   ├── react/rules/
│   ├── nextjs/rules/
│   ├── nestjs/rules/
│   ├── golang/rules/
│   ├── python/rules/
│   └── typescript/rules/
│
├── skills/                   # Full skills (for CDN/on-demand)
├── skills-index.json         # Lightweight index
├── rules-index.json          # Rules metadata
└── package.json
```

#### Installed Per-Project (.claude/)

```
.claude/                      # ~300-500KB total
├── commands/                 # ~150KB - merged commands
│   ├── plan.md
│   ├── plan/
│   ├── fix.md
│   ├── fix/
│   └── ...
├── rules/                    # ~50-200KB - only detected tech
│   ├── react/               # If React detected
│   ├── typescript/          # If TS detected
│   └── nextjs/              # If Next.js detected
├── hooks/                    # ~30KB
│   └── ...
├── skills-index.json         # ~30KB
├── devkit.json               # ~1KB - tracking
└── settings.json             # ~1KB
```

---

## Implementation Tasks

### Task 1: Create Project Detection
- [x] Create `cli/detect.js` with detection rules
- [x] Add dependency parsing from package.json
- [x] Add file pattern matching

### Task 2: Merge Commands
- [x] Create `scripts/merge-commands.js`
- [x] Define merge rules (prefer claudekit vs agent-assistant)
- [x] Generate `merged-commands/` directory
- [x] Handle conflicts by combining sub-commands

### Task 3: Reorganize Rules
- [x] Create `templates/` directory structure
- [x] Copy rules from `rules/` to appropriate `templates/{tech}/rules/`
- [x] Generate `rules-index.json`

### Task 4: Refactor CLI
- [x] Remove `install` command from `cli/index.js`
- [x] Create new `cli/init.js` with detection + smart installation
- [x] Create `cli/update.js`
- [x] Update help text

### Task 5: Update Package.json
- [x] Update `files` array for npm publish
- [x] Add `merge-commands` script
- [x] Update version to 3.0.0

### Task 6: Testing
- [x] Test on Flutter project
- [x] Test on React/Next.js project
- [x] Test on Golang project
- [x] Test on Python project
- [x] Verify context size is under 500KB

---

## Migration Guide

### For Existing Users

```bash
# 1. Remove global installation
devkit uninstall
rm -rf ~/.claude/skills ~/.claude/rules ~/.claude/commands

# 2. Update package
npm update -g @ngxtm/devkit

# 3. Initialize per-project
cd your-project
devkit init

# 4. Verify
ls .claude/
# Should show: commands/ rules/ hooks/ devkit.json skills-index.json
```

### Breaking Changes

| v2.x | v3.x |
|------|------|
| `devkit install` | REMOVED |
| `devkit install --lite` | REMOVED |
| `devkit install --full` | REMOVED |
| Global `~/.claude/` | Per-project `.claude/` |
| All rules installed | Only detected rules |
| Full skills installed | Skills index only |

---

## Expected Outcomes

1. **No more context limit crashes** - ~500KB vs 59MB
2. **Best practices enforced** - Only relevant rules loaded
3. **Fast installation** - Seconds instead of minutes
4. **Easy updates** - `devkit update` re-detects and refreshes
5. **All features preserved** - Commands, skills (on-demand), hooks work as before
