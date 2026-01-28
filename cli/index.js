#!/usr/bin/env node

/**
 * Devkit Agent Assistant CLI
 *
 * Main entry point for the CLI tool.
 */

const path = require('path');
const fs = require('fs');

const VERSION = require('../package.json').version;
const {
  install,
  uninstall,
  update,
  interactiveInstall,
  listSkills,
  listCategories
} = require('./install');

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const options = {
    command: null,
    tool: null,
    minimal: false,
    lite: false,      // New: commands only, no skills/rules/hooks
    categories: [],
    interactive: false,
    fullSkills: false,
    indexOnly: true,  // Default: index-only mode
    help: false
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--minimal' || arg === '-m') {
      options.minimal = true;
      options.indexOnly = false;
    } else if (arg === '--lite' || arg === '-l') {
      options.lite = true;
      options.indexOnly = false;
    } else if (arg === '--interactive' || arg === '-i') {
      options.interactive = true;
    } else if (arg === '--full' || arg === '-f') {
      options.fullSkills = true;
      options.indexOnly = false;
    } else if (arg.startsWith('--category=') || arg.startsWith('-c=')) {
      const cats = arg.split('=')[1].split(',').map(c => c.trim());
      options.categories.push(...cats);
      options.indexOnly = false;
    } else if (arg.startsWith('--')) {
      // Unknown flag, ignore
    } else if (!options.command) {
      options.command = arg;
    } else if (!options.tool) {
      options.tool = arg;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Devkit v${VERSION}

USAGE:
  devkit <command> [tool] [options]

COMMANDS:
  install     Install skills and rules to AI tools
  uninstall   Remove all installed skills and rules
  update      Check for updates and reinstall
  list        List all available skills
  categories  List available skill categories
  version     Show version
  help        Show this help

TOOLS:
  claude      Claude Code (~/.claude/)
  cursor      Cursor (~/.cursor/)
  copilot     GitHub Copilot (~/.copilot/)
  gemini      Gemini / Antigravity (~/.gemini/)

OPTIONS:
  --lite, -l              LITE mode - commands only, no skills/rules/hooks
                          Best for avoiding context limit issues
                          Installs: /brainstorm, /plan, /fix, /code, etc.

  (default)               Index-only mode - installs skills index file only
                          Commands and agents are always fully installed
                          May still cause context issues with some models

  --minimal, -m           Install ~20 core skills (instead of index)

  --category=CATS, -c=    Install specific categories
                          Example: --category=react,typescript,testing

  --full, -f              Install ALL 413+ skills (may cause context limit)
                          Only use if you need full skill content locally

  --interactive, -i       Interactive mode - choose categories

  --help, -h              Show this help

EXAMPLES:
  devkit install --lite             # Commands only (recommended for context limit)
  devkit install                    # Index-only (default)
  devkit install claude             # Index-only to Claude Code
  devkit install --minimal          # Install ~20 core skills
  devkit install --category=react   # Install React-related skills
  devkit install --full             # Install all skills (large)
  devkit install --interactive      # Choose interactively
  devkit uninstall                  # Remove from all tools

HOW IT WORKS:
  By default, devkit installs:
  - SKILLS_INDEX.md (29KB summary of 411 skills)
  - All commands (/plan, /cook, /brainstorm, etc.)
  - All agents (planner, debugger, reviewer, etc.)
  - Hooks, rules, output-styles

  When you need a specific skill, Claude reads it on-demand from
  the skills-index.json or loads the full skill file.

  This reduces context usage from ~59MB to ~30KB for skills.

For more info: https://github.com/ngxtm/devkit
  `);
}

// Command handlers
const commands = {
  install: (options) => {
    if (options.interactive) {
      return interactiveInstall(options.tool);
    }
    install(options.tool, {
      minimal: options.minimal,
      lite: options.lite,
      categories: options.categories,
      fullSkills: options.fullSkills,
      indexOnly: options.indexOnly
    });
  },
  uninstall: (options) => uninstall(options.tool),
  update: () => update(),
  list: () => listSkills(),
  categories: () => listCategories(),
  help: () => showHelp(),
  version: () => console.log(`v${VERSION}`),
};

// Main execution
const args = process.argv.slice(2);
const options = parseArgs(args);

// Show help if requested
if (options.help) {
  showHelp();
  process.exit(0);
}

// Default to help if no command
const command = options.command || 'help';

if (commands[command]) {
  const result = commands[command](options);
  // Handle async commands
  if (result instanceof Promise) {
    result.catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
  }
} else {
  console.log(`Unknown command: ${command}`);
  showHelp();
  process.exit(1);
}
