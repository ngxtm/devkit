#!/usr/bin/env node

/**
 * Devkit Agent Assistant CLI
 *
 * Main entry point for the CLI tool.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const VERSION = require('../package.json').version;

const commands = {
  install: () => require('./install').install(),
  update: () => require('./install').update(),
  list: () => listSkills(),
  help: () => showHelp(),
  version: () => console.log(`v${VERSION}`),
};

function showHelp() {
  console.log(`
Devkit Agent Assistant v${VERSION}

USAGE:
  devkit-agent <command>

COMMANDS:
  install     Install skills and rules to AI tools (Claude, Cursor, Copilot)
  update      Check for updates and reinstall
  list        List all available skills
  version     Show version
  help        Show this help

EXAMPLES:
  devkit-agent install       # Install to all supported tools
  devkit-agent list          # Show available skills

For more info: https://github.com/YOUR_USERNAME/devkit-agent-assistant
  `);
}

function listSkills() {
  const skillsDir = path.join(__dirname, '..', 'skills');

  if (!fs.existsSync(skillsDir)) {
    console.log('No skills directory found.');
    return;
  }

  const skills = fs.readdirSync(skillsDir)
    .filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory())
    .filter(f => !f.startsWith('.'));

  console.log(`\nAvailable Skills (${skills.length} total):\n`);

  skills.forEach(skill => {
    console.log(`  - ${skill}`);
  });

  console.log('\nUse "devkit-agent install" to install these skills.\n');
}

// Main execution
const command = process.argv[2] || 'help';

if (commands[command]) {
  commands[command]();
} else {
  console.log(`Unknown command: ${command}`);
  showHelp();
  process.exit(1);
}
