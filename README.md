# Devkit Agent Assistant

> Unified multi-agent system with auto-synced skills from multiple sources

[![npm version](https://img.shields.io/npm/v/@devkit/agent-assistant.svg)](https://www.npmjs.com/package/@devkit/agent-assistant)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **414+ Skills** - Merged from antigravity, agent-assistant, and claudekit
- **38 Agents** - 20 from agent-assistant + 18 from claudekit
- **57 Commands** - Full workflow commands from both sources
- **9 Hooks** - Session management, privacy, context awareness (claudekit)
- **6 Output Styles** - Coding levels from ELI5 to God mode (claudekit)
- **10 Rules** - Coding standards for TypeScript, React, NestJS, etc.
- **Matrix Skill Discovery** - Intelligent skill injection based on context
- **Auto-Sync** - Daily updates from upstream sources via GitHub Actions

## Sources

| Source | What's Included |
|--------|-----------------|
| [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) | 256+ skills (primary, frequently updated) |
| [agent-assistant](https://github.com/hainamchung/agent-assistant) | 310+ skills, Matrix system, 20 agents, 25 commands |
| [claudekit](https://github.com/anthropics/claudekit) | 45 skills, 18 agents, 32 commands, hooks, output styles |
| [skill-rule](https://github.com/ngxtm/skill-rule) | Coding standards for 10 frameworks |

## Installation

```bash
npm install -g @devkit/agent-assistant
devkit-agent install
```

### Install to specific tool only

```bash
devkit-agent install claude    # Claude Code only
devkit-agent install cursor    # Cursor only
```

## What Gets Installed

### For Claude Code (`~/.claude/`)

```
~/.claude/
├── skills/                   # 414+ skills
│   └── agent-assistant/      # Core framework
│       ├── agents/           # 20 agents
│       ├── commands/         # 25 commands
│       ├── matrix-skills/    # Skill discovery system
│       └── claudekit/        # Claudekit components
│           ├── agents/       # 18 agents
│           └── commands/     # 32 commands
├── rules/                    # Coding standards
├── hooks/                    # 9 hooks
├── output-styles/            # 6 coding levels
├── workflows/                # Workflow definitions
└── settings.json             # Claude settings
```

### For Other Tools

- **Cursor**: Skills, agents, commands, rules
- **GitHub Copilot**: Skills, rules
- **Gemini/Antigravity**: Skills, rules

## Quick Start Commands

After installation, use these commands in your AI coding tool:

### From agent-assistant
```
/cook           - Build a feature with full workflow
/plan           - Plan implementation strategy
/review         - Code review
/test           - Run tests
/fix            - Fix bugs
```

### From claudekit
```
/bootstrap      - Setup new project
/coding-level   - Set output style (eli5/junior/mid/senior/lead/god)
/code           - Code with workflow
/scout          - Explore codebase
/kanban         - Manage tasks
```

## Output Styles (claudekit)

Set your preferred coding level:

| Level | Style | Best For |
|-------|-------|----------|
| `/coding-level 0` | ELI5 | Learning, explanations |
| `/coding-level 1` | Junior | Detailed comments, safe patterns |
| `/coding-level 2` | Mid | Balanced, best practices |
| `/coding-level 3` | Senior | Concise, optimized |
| `/coding-level 4` | Lead | Architecture focus |
| `/coding-level 5` | God | Minimal, maximum efficiency |

## Hooks (Claude Code only)

Claudekit hooks provide:
- **session-init** - Initialize session context
- **privacy-block** - Protect sensitive files
- **scout-block** - Control exploration scope
- **dev-rules-reminder** - Enforce coding standards
- **usage-context-awareness** - Smart context management
- And more...

## Auto-Sync

Skills and rules are automatically updated via GitHub Actions:

- **Skills**: Daily sync from antigravity + agent-assistant
- **Rules**: Weekly sync from skill-rule
- **Hooks/Claudekit**: Manual sync (local source)

## Configuration

Edit `SYNC_CONFIG.yaml` to customize sources:

```yaml
skill_sources:
  - name: antigravity-awesome-skills
    repo: sickn33/antigravity-awesome-skills
    enabled: true
    priority: 1

  - name: agent-assistant
    repo: hainamchung/agent-assistant
    enabled: true
    priority: 2

sync:
  merge_strategy: prefer-primary
  schedule: "0 0 * * *"
```

## Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/devkit-agent-assistant.git
cd devkit-agent-assistant

# Install dependencies
npm install

# Run initial sync (first time only)
# Windows:
initial-sync.bat

# Linux/Mac:
./initial-sync.sh

# Test install locally
node cli/install.js
```

## Contributing

1. Fork the repository
2. Add your skills to `skills/your-skill-name/SKILL.md`
3. Run `python scripts/update_matrix.py`
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

- [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) by sickn33
- [agent-assistant](https://github.com/hainamchung/agent-assistant) by hainamchung
- [claudekit](https://github.com/anthropics/claudekit) by Anthropic
- [skill-rule](https://github.com/ngxtm/skill-rule) by ngxtm
