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
    } else if (arg === '--status' || arg === '-s') {
      options.command = 'status';
    } else if (arg.startsWith('--path=')) {
      options.path = arg.split('=')[1];
    } else if (arg.startsWith('--')) {
      // Handle legacy options for backwards compatibility
      if (arg === '--minimal' || arg === '-m') options.minimal = true;
      if (arg === '--lite' || arg === '-l') options.lite = true;
      if (arg === '--interactive' || arg === '-i') options.interactive = true;
      if (arg === '--full') options.fullSkills = true;
      if (arg.startsWith('--category=')) {
        const cats = arg.split('=')[1].split(',').map(c => c.trim());
        options.categories.push(...cats);
      }
    } else if (!options.command) {
      options.command = arg;
    } else if (!options.path && !options.tool) {
      // Could be a path or a tool name (legacy)
      if (['claude', 'cursor', 'copilot', 'gemini'].includes(arg)) {
        options.tool = arg;
      } else {
        options.path = arg;
      }
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
  init          Initialize devkit in current project (.claude/ folder)
                Auto-detects tech stack and installs relevant rules only.
                This is the PRIMARY command - use this for new projects.

  update        Update existing installation
                Re-detects project type and updates rules accordingly.

  detect        Show detected technologies for current project
                Useful to see what devkit will install.

  status        Show installation status

  uninstall     Remove devkit from current project

  list          List all available skills

  help          Show this help

  version       Show version

OPTIONS:
  --force, -f   Force overwrite existing installation
  --clean, -c   Remove rules for technologies no longer detected (with update)
  --path=DIR    Specify project directory (default: current directory)
  --help, -h    Show this help

EXAMPLES:
  devkit init                 # Initialize in current project
  devkit init --force         # Overwrite existing installation
  devkit update               # Update and re-detect technologies
  devkit update --clean       # Update and remove old rules
  devkit detect               # Show what would be detected
  devkit status               # Show current installation
  devkit uninstall            # Remove from current project

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
  // Primary command - per-project init
  init: (options) => {
    const projectPath = validatePath(options.path) || process.cwd();
    return initProject({
      path: projectPath,
      force: options.force,
      update: options.update
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
