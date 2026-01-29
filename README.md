# Devkit

> Unified multi-agent skill system for AI coding assistants

[![npm version](https://img.shields.io/npm/v/@ngxtm/devkit.svg)](https://www.npmjs.com/package/@ngxtm/devkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Supercharge your AI coding assistant with **414+ skills**, **38 agents**, and **57 commands**. Works with Claude Code, Cursor, GitHub Copilot, and Gemini.

## Features

- **Smart Tech Detection** - Automatically detects your project stack and loads relevant skills
- **Per-Project Installation** - Install only what you need, where you need it
- **Context-Optimized** - Index-only mode reduces context usage by 99.95%
- **Auto-Sync** - Daily updates from upstream sources via GitHub Actions
- **Multi-Tool Support** - Works with Claude, Cursor, Copilot, and Gemini

## Quick Start

```bash
npm install -g @ngxtm/devkit
devkit install
```

## Installation Modes

| Mode | Command | Size | Description |
|------|---------|------|-------------|
| **Index-only** | `devkit install` | ~30KB | On-demand skill loading (recommended) |
| Minimal | `devkit install --minimal` | ~2MB | ~20 core skills |
| Category | `devkit install -c=react,ts` | varies | Specific categories only |
| Full | `devkit install --full` | ~59MB | All 414+ skills |

## Commands

```bash
# Planning & Building
/plan           # Create implementation strategy
/cook           # Build feature with full workflow
/code           # Code with workflow

# Development
/fix            # Fix bugs
/test           # Run tests
/review         # Code review
/scout          # Explore codebase

# Setup
/bootstrap      # Setup new project
/coding-level   # Set output style (eli5 → god)
/kanban         # Manage tasks
```

## Coding Levels

| Level | Command | Style |
|-------|---------|-------|
| 0 | `/coding-level 0` | ELI5 - Learning friendly |
| 1 | `/coding-level 1` | Junior - Detailed comments |
| 2 | `/coding-level 2` | Mid - Balanced |
| 3 | `/coding-level 3` | Senior - Concise |
| 4 | `/coding-level 4` | Lead - Architecture focus |
| 5 | `/coding-level 5` | God - Maximum efficiency |

## Categories

```bash
devkit categories    # List all categories
```

| Category | Skills | Category | Skills |
|----------|--------|----------|--------|
| react | 9 | database | 5 |
| typescript | 4 | devops | 7 |
| node | 6 | testing | 6 |
| security | 5 | ai | 6 |
| mobile | 5 | frontend | 6 |
| backend | 6 | tools | 6 |

## Uninstall

```bash
devkit uninstall          # Remove from all tools
devkit uninstall claude   # Remove from specific tool
```

## Contributing

1. Fork the repository
2. Add skills to `skills/your-skill-name/SKILL.md`
3. Run `python scripts/update_matrix.py`
4. Submit a pull request

## License

MIT
