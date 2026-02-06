#!/usr/bin/env node

/**
 * Devkit CLI v3
 *
 * Per-project installation with smart tech detection.
 * Main entry point for the CLI tool.
 */

const path = require('path');
const fs = require('fs');

const VERSION = require('../package.json').version;

// New modular imports
const { initProject, uninstallProject } = require('./init');
const { updateProject, showStatus } = require('./update');
const { detectProjectType, getRulesForTypes, printDetectionResults } = require('./detect');
const { validatePath } = require('./utils');
const { listRules, addRules, removeRules } = require('./rules');

// Legacy imports for backwards compatibility (will be deprecated)
let legacyInstall = null;
try {
  const legacy = require('./install');
  legacyInstall = legacy;
} catch (e) {
  // Legacy install not available, that's fine
}

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const options = {
    command: null,
    path: null,
    force: false,
    update: false,
    clean: false,
    help: false,
    installed: false,
    ruleArgs: [],
    // New v3.6 options
    all: false,
    tools: [],
    // Legacy options (deprecated)
    tool: null,
    minimal: false,
    lite: false,
    categories: [],
    interactive: false,
    fullSkills: false,
    indexOnly: true
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--force' || arg === '-f') {
      options.force = true;
    } else if (arg === '--update' || arg === '-u') {
      options.update = true;
    } else if (arg === '--clean' || arg === '-c') {
      options.clean = true;
    } else if (arg === '--installed' || arg === '-i') {
      options.installed = true;
    } else if (arg === '--all' || arg === '-a') {
      options.all = true;
    } else if (arg === '--status' || arg === '-s') {
      options.command = 'status';
    } else if (arg.startsWith('--path=')) {
      options.path = arg.split('=')[1];
    } else if (arg.startsWith('--tools=')) {
      options.tools = arg.split('=')[1].split(',').map(t => t.trim());
    } else if (arg.startsWith('--')) {
      // Handle legacy options for backwards compatibility
      if (arg === '--minimal' || arg === '-m') options.minimal = true;
      if (arg === '--lite' || arg === '-l') options.lite = true;
      if (arg.startsWith('--category=')) {
        const cats = arg.split('=')[1].split(',').map(c => c.trim());
        options.categories.push(...cats);
      }
    } else if (!options.command) {
      options.command = arg;
    } else {
      // Additional args (for add/remove commands)
      options.ruleArgs.push(arg);
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Devkit v${VERSION} - Per-Project AI Skills

USAGE:
  devkit <command> [options]

COMMANDS:
  init          Initialize devkit in current project
                Shows interactive tool selection menu.
                Auto-detects tech stack and installs relevant rules.

  update        Update existing installation
                Re-detects project type and updates rules accordingly.

  detect        Show detected technologies for current project
                Useful to see what devkit will install.

  rules         List all available rules
                Use --installed to show only installed rules.

  add <rule>    Add rules manually (space-separated)
                Example: devkit add golang docker

  remove <rule> Remove rules from project
                Example: devkit remove flutter

  status        Show installation status

  uninstall     Remove devkit from current project

  list          List all available skills

  help          Show this help

  version       Show version

OPTIONS:
  --force, -f     Force overwrite existing installation
  --all, -a       Install for all supported tools (skip menu)
  --tools=LIST    Install for specific tools (comma-separated)
                  Example: --tools=claude,cursor
  --clean, -c     Remove rules for technologies no longer detected (with update)
  --installed, -i Show only installed rules (with rules command)
  --path=DIR      Specify project directory (default: current directory)
  --help, -h      Show this help

SUPPORTED TOOLS:
  claude        Claude Code
  cursor        Cursor
  copilot       GitHub Copilot
  gemini        Gemini CLI

EXAMPLES:
  devkit init                   # Interactive tool selection
  devkit init --all             # Install for all tools
  devkit init --tools=claude,cursor  # Install for specific tools
  devkit init --force           # Overwrite existing installation
  devkit update                 # Update and re-detect technologies
  devkit update --clean         # Update and remove old rules
  devkit detect                 # Show what would be detected
  devkit rules                  # List all available rules
  devkit rules --installed      # Show installed rules
  devkit add golang docker      # Add golang and docker rules
  devkit remove flutter         # Remove flutter rule
  devkit status                 # Show current installation
  devkit uninstall              # Remove from current project

HOW IT WORKS:
  1. devkit init analyzes your project files:
     - package.json → React, Next.js, NestJS, etc.
     - pubspec.yaml → Flutter
     - go.mod → Golang
     - pyproject.toml → Python

  2. Installs ONLY relevant content:
     - Merged commands (~100 commands, ~150KB)
     - Tech-specific rules (based on detection)
     - Skills index (for on-demand loading)
     - Essential hooks

  3. Total size: ~300-500KB (vs 59MB for global install)

  This ensures best practices for your tech stack without
  overwhelming Claude with irrelevant rules.

For more info: https://github.com/ngxtm/devkit
  `);
}

function showDeprecationWarning(cmd) {
  console.log(`
⚠️  DEPRECATION WARNING
========================
The 'devkit ${cmd}' command is deprecated in v3.

Global installation caused context limit issues (~59MB).
Use per-project installation instead:

  devkit init    # Initialize in current project (~300-500KB)

This auto-detects your tech stack and installs only relevant rules.
  `);
}

// Command handlers
const commands = {
  // Primary command - per-project init (now async with tool selection)
  init: async (options) => {
    const projectPath = validatePath(options.path) || process.cwd();
    return initProject({
      path: projectPath,
      force: options.force,
      update: options.update,
      all: options.all,
      tools: options.tools
    });
  },

  // Update existing installation
  update: (options) => {
    const projectPath = validatePath(options.path) || process.cwd();
    return updateProject({
      path: projectPath,
      force: options.force,
      clean: options.clean
    });
  },

  // Detect project type
  detect: (options) => {
    const projectDir = validatePath(options.path) || process.cwd();
    printDetectionResults(projectDir);
    return { success: true };
  },

  // Show status
  status: (options) => {
    const projectPath = validatePath(options.path) || process.cwd();
    return showStatus({
      path: projectPath
    });
  },

  // Uninstall
  uninstall: (options) => {
    const projectPath = validatePath(options.path) || process.cwd();
    return uninstallProject({
      path: projectPath
    });
  },

  // List available rules
  rules: (options) => {
    const projectPath = validatePath(options.path) || process.cwd();
    return listRules({
      path: projectPath,
      installed: options.installed
    });
  },

  // Add rules manually
  add: (options) => {
    const projectPath = validatePath(options.path) || process.cwd();
    if (options.ruleArgs.length === 0) {
      console.log('\n  Usage: devkit add <rule> [rule2 ...]');
      console.log('  Example: devkit add golang docker\n');
      console.log('  Run "devkit rules" to see available rules.\n');
      return { success: false, reason: 'no_rules' };
    }
    return addRules(options.ruleArgs, { path: projectPath });
  },

  // Remove rules
  remove: (options) => {
    const projectPath = validatePath(options.path) || process.cwd();
    if (options.ruleArgs.length === 0) {
      console.log('\n  Usage: devkit remove <rule> [rule2 ...]');
      console.log('  Example: devkit remove flutter\n');
      console.log('  Run "devkit rules --installed" to see installed rules.\n');
      return { success: false, reason: 'no_rules' };
    }
    return removeRules(options.ruleArgs, { path: projectPath });
  },

  // List skills (from skills-index.json)
  list: () => {
    const indexPath = path.join(__dirname, '..', 'skills-index.json');
    if (!fs.existsSync(indexPath)) {
      console.log('Skills index not found.');
      return;
    }

    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    console.log(`\nAvailable Skills (${index.skills?.length || 0} total):\n`);

    // Group by category
    const categories = {};
    for (const skill of (index.skills || [])) {
      const cat = skill.category || 'other';
      categories[cat] = categories[cat] || [];
      categories[cat].push(skill.name);
    }

    for (const [cat, skills] of Object.entries(categories).sort()) {
      console.log(`  ${cat} (${skills.length}):`);
      skills.slice(0, 5).forEach(s => console.log(`    - ${s}`));
      if (skills.length > 5) {
        console.log(`    ... and ${skills.length - 5} more`);
      }
      console.log('');
    }
  },

  // Help
  help: () => showHelp(),

  // Version
  version: () => console.log(`v${VERSION}`),

  // Legacy commands (deprecated) - redirect with warning
  install: (options) => {
    showDeprecationWarning('install');

    // Still try to run if legacy module available
    if (legacyInstall && legacyInstall.install) {
      console.log('Running legacy install anyway...\n');
      return legacyInstall.install(options.tool, {
        minimal: options.minimal,
        lite: options.lite,
        categories: options.categories,
        fullSkills: options.fullSkills,
        indexOnly: options.indexOnly
      });
    }
  },

  categories: () => {
    if (legacyInstall && legacyInstall.listCategories) {
      return legacyInstall.listCategories();
    }
    console.log('Use: devkit list');
  }
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
