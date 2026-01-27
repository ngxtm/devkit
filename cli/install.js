#!/usr/bin/env node

/**
 * Devkit Agent Assistant - Installer
 *
 * Installs skills, agents, commands, hooks, and rules to various AI coding tools.
 * Merged from: antigravity-awesome-skills, agent-assistant, claudekit, skill-rule
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const PACKAGE_ROOT = path.join(__dirname, '..');

// Supported tools and their paths
const TOOLS = {
  'cursor': {
    name: 'Cursor',
    basePath: path.join(HOME, '.cursor'),
    skillsPath: path.join(HOME, '.cursor', 'skills'),
    rulesPath: path.join(HOME, '.cursor', 'rules'),
    hooksPath: path.join(HOME, '.cursor', 'hooks'),
    commandsPath: path.join(HOME, '.cursor', 'commands'),
    supportsHooks: false,
    configFile: 'CURSOR.md'
  },
  'claude': {
    name: 'Claude Code',
    basePath: path.join(HOME, '.claude'),
    skillsPath: path.join(HOME, '.claude', 'skills'),
    rulesPath: path.join(HOME, '.claude', 'rules'),
    hooksPath: path.join(HOME, '.claude', 'hooks'),
    commandsPath: path.join(HOME, '.claude', 'commands'),
    supportsHooks: true,
    configFile: 'CLAUDE.md'
  },
  'copilot': {
    name: 'GitHub Copilot',
    basePath: path.join(HOME, '.copilot'),
    skillsPath: path.join(HOME, '.copilot', 'skills'),
    rulesPath: path.join(HOME, '.github', 'rules'),
    hooksPath: null,
    commandsPath: null,
    supportsHooks: false,
    configFile: null
  },
  'gemini': {
    name: 'Gemini / Antigravity',
    basePath: path.join(HOME, '.gemini'),
    skillsPath: path.join(HOME, '.gemini', 'antigravity', 'skills'),
    rulesPath: path.join(HOME, '.gemini', 'rules'),
    hooksPath: null,
    commandsPath: null,
    supportsHooks: false,
    configFile: 'GEMINI.md'
  }
};

/**
 * Copy directory recursively with optional text replacement
 */
function copyDir(src, dest, replacements = {}) {
  if (!fs.existsSync(src)) {
    return 0;
  }

  fs.mkdirSync(dest, { recursive: true });
  let count = 0;

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    // Skip hidden files and __tests__
    if (entry.name.startsWith('.') || entry.name === '__tests__' || entry.name === 'tests') {
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath, replacements);
    } else {
      let content = fs.readFileSync(srcPath);

      // Apply text replacements if it's a text file
      if (isTextFile(entry.name)) {
        let text = content.toString('utf-8');
        for (const [key, value] of Object.entries(replacements)) {
          text = text.replace(new RegExp(key, 'g'), value);
        }
        content = text;
      }

      fs.writeFileSync(destPath, content);
      count++;
    }
  }

  return count;
}

function isTextFile(filename) {
  const textExtensions = ['.md', '.txt', '.yaml', '.yml', '.json', '.js', '.cjs', '.ts', '.py', '.sh', '.ps1'];
  return textExtensions.some(ext => filename.endsWith(ext));
}

/**
 * Install to a specific tool
 */
function installToTool(toolId, tool, options = {}) {
  console.log(`\n📦 Installing to ${tool.name}...`);

  const replacements = {
    '\\{TOOL\\}': toolId,
    '\\{HOME\\}': HOME,
    '\\$HOME': HOME
  };

  let totalFiles = 0;

  // 1. Install skills (merged from all sources)
  const srcSkills = path.join(PACKAGE_ROOT, 'skills');
  if (fs.existsSync(srcSkills)) {
    const count = copyDir(srcSkills, tool.skillsPath, replacements);
    console.log(`  ✅ Skills: ${count} files`);
    totalFiles += count;
  }

  // 2. Install core framework under agent-assistant subfolder
  const coreDir = path.join(tool.skillsPath, 'agent-assistant');
  const coreComponents = ['agents', 'commands', 'matrix-skills'];

  for (const name of coreComponents) {
    const srcPath = path.join(PACKAGE_ROOT, name);
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(coreDir, name);
      const count = copyDir(srcPath, destPath, replacements);
      console.log(`  ✅ ${name}: ${count} files`);
      totalFiles += count;
    }
  }

  // 3. Install claudekit components (agents, commands) if available
  const claudekitComponents = ['agents-claudekit', 'commands-claudekit'];
  for (const name of claudekitComponents) {
    const srcPath = path.join(PACKAGE_ROOT, name);
    if (fs.existsSync(srcPath)) {
      const destName = name.replace('-claudekit', '');
      const destPath = path.join(coreDir, 'claudekit', destName);
      const count = copyDir(srcPath, destPath, replacements);
      console.log(`  ✅ claudekit/${destName}: ${count} files`);
      totalFiles += count;
    }
  }

  // 4. Install rules
  const srcRules = path.join(PACKAGE_ROOT, 'rules');
  if (fs.existsSync(srcRules) && tool.rulesPath) {
    const count = copyDir(srcRules, tool.rulesPath, replacements);
    console.log(`  ✅ Rules: ${count} files`);
    totalFiles += count;
  }

  // 5. Install hooks (Claude Code only)
  if (tool.supportsHooks && tool.hooksPath) {
    const srcHooks = path.join(PACKAGE_ROOT, 'hooks');
    if (fs.existsSync(srcHooks)) {
      const count = copyDir(srcHooks, tool.hooksPath, replacements);
      console.log(`  ✅ Hooks: ${count} files`);
      totalFiles += count;
    }
  }

  // 6. Install output-styles (Claude Code only)
  if (toolId === 'claude') {
    const srcStyles = path.join(PACKAGE_ROOT, 'output-styles');
    if (fs.existsSync(srcStyles)) {
      const destStyles = path.join(tool.basePath, 'output-styles');
      const count = copyDir(srcStyles, destStyles, replacements);
      console.log(`  ✅ Output Styles: ${count} files`);
      totalFiles += count;
    }

    // 7. Install workflows
    const srcWorkflows = path.join(PACKAGE_ROOT, 'workflows');
    if (fs.existsSync(srcWorkflows)) {
      const destWorkflows = path.join(tool.basePath, 'workflows');
      const count = copyDir(srcWorkflows, destWorkflows, replacements);
      console.log(`  ✅ Workflows: ${count} files`);
      totalFiles += count;
    }

    // 8. Copy statusline scripts
    const statuslineFiles = ['statusline.cjs', 'statusline.ps1', 'statusline.sh'];
    for (const file of statuslineFiles) {
      const srcFile = path.join(PACKAGE_ROOT, file);
      if (fs.existsSync(srcFile)) {
        const destFile = path.join(tool.basePath, file);
        fs.copyFileSync(srcFile, destFile);
        totalFiles++;
      }
    }

    // 9. Copy settings.json if not exists
    const srcSettings = path.join(PACKAGE_ROOT, 'settings.json');
    const destSettings = path.join(tool.basePath, 'settings.json');
    if (fs.existsSync(srcSettings) && !fs.existsSync(destSettings)) {
      fs.copyFileSync(srcSettings, destSettings);
      console.log(`  ✅ Settings: copied`);
      totalFiles++;
    }
  }

  console.log(`  📊 Total: ${totalFiles} files installed`);
  return totalFiles;
}

/**
 * Main install function
 */
function install(targetTool = null) {
  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT - INSTALLER');
  console.log('  Merged: antigravity + agent-assistant + claudekit + skill-rule');
  console.log('='.repeat(60));

  const tools = targetTool ? [targetTool] : Object.keys(TOOLS);
  console.log(`\nInstalling to ${tools.length} tool(s)...`);

  let totalInstalled = 0;

  for (const toolId of tools) {
    if (!TOOLS[toolId]) {
      console.log(`\n❌ Unknown tool: ${toolId}`);
      continue;
    }
    const tool = TOOLS[toolId];
    totalInstalled += installToTool(toolId, tool);
  }

  console.log('\n' + '='.repeat(60));
  console.log('  ✅ INSTALLATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`\nTotal files installed: ${totalInstalled}`);
  console.log('\nRestart your AI coding tool to use the new skills.');
  console.log('\nUsage examples:');
  console.log('  /cook            - Build a feature');
  console.log('  /plan            - Plan implementation');
  console.log('  /review          - Code review');
  console.log('  /bootstrap       - Setup new project (claudekit)');
  console.log('  /coding-level    - Set output style (claudekit)');
  console.log('');
}

/**
 * Update function
 */
function update() {
  console.log('Checking for updates...\n');
  console.log('Run: npm update -g @ngxtm/devkit');
  console.log('Then: devkit-agent install');
}

// Export for CLI
module.exports = { install, update, TOOLS };

// Run if called directly
if (require.main === module) {
  const targetTool = process.argv[2];
  install(targetTool);
}
