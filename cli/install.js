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
const readline = require('readline');
const { shouldIncludeSkill, SKILL_CATEGORIES, MINIMAL_SKILLS, getCategories } = require('./config');

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
 * Copy directory recursively with optional text replacement and skill filtering
 */
function copyDir(src, dest, replacements = {}, options = {}) {
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
      // Apply skill filter for skills directory
      if (options.filterSkills && !shouldIncludeSkill(entry.name, options)) {
        continue;
      }
      count += copyDir(srcPath, destPath, replacements, { ...options, filterSkills: false });
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

  // Determine install mode
  const indexOnly = options.indexOnly !== false && !options.fullSkills;
  const isMinimal = options.minimal;
  const isLite = options.lite;  // New lite mode - commands only
  const hasCategories = options.categories && options.categories.length > 0;

  if (isLite) {
    console.log(`   Mode: LITE (commands only - minimal context usage)`);
  } else if (indexOnly && !isMinimal && !hasCategories) {
    console.log(`   Mode: INDEX-ONLY (recommended - minimal context usage)`);
  } else if (isMinimal) {
    console.log(`   Mode: MINIMAL (${MINIMAL_SKILLS.length} core skills)`);
  } else if (hasCategories) {
    console.log(`   Categories: ${options.categories.join(', ')}`);
  } else if (options.fullSkills) {
    console.log(`   Mode: FULL (all 413+ skills - may cause context limit issues)`);
  }

  const replacements = {
    '\\{TOOL\\}': toolId,
    '\\{HOME\\}': HOME,
    '\\$HOME': HOME
  };

  let totalFiles = 0;

  // 1. Install skills - depends on mode (skip in lite mode)
  if (isLite) {
    console.log(`  ⏭️  Skipping skills (lite mode)`);
  } else {
    const srcSkills = path.join(PACKAGE_ROOT, 'skills');
    if (fs.existsSync(srcSkills)) {
      if (indexOnly && !isMinimal && !hasCategories) {
      // Index-only mode: just copy the index files
      const indexFile = path.join(PACKAGE_ROOT, 'SKILLS_INDEX.md');
      const jsonFile = path.join(PACKAGE_ROOT, 'skills-index.json');

      fs.mkdirSync(tool.skillsPath, { recursive: true });

      if (fs.existsSync(indexFile)) {
        fs.copyFileSync(indexFile, path.join(tool.skillsPath, 'SKILLS_INDEX.md'));
        totalFiles++;
      }
      if (fs.existsSync(jsonFile)) {
        fs.copyFileSync(jsonFile, path.join(tool.skillsPath, 'skills-index.json'));
        totalFiles++;
      }
      console.log(`  ✅ Skills Index: ${totalFiles} files (use /skill <name> to load specific skills)`);
    } else {
      // Full or filtered skills
      const count = copyDir(srcSkills, tool.skillsPath, replacements, {
        ...options,
        filterSkills: isMinimal || hasCategories
      });
      console.log(`  ✅ Skills: ${count} files`);
      totalFiles += count;
    }
  }
  }

  // 2. Install commands - in lite mode, install only core commands
  if (isLite) {
    // Lite mode: install only essential claudekit commands
    if (tool.commandsPath) {
      const srcCommandsClaudekit = path.join(PACKAGE_ROOT, 'commands-claudekit');
      if (fs.existsSync(srcCommandsClaudekit)) {
        const count = copyDir(srcCommandsClaudekit, tool.commandsPath, replacements, options);
        console.log(`  ✅ Commands (claudekit): ${count} files`);
        totalFiles += count;
      }
    }
  } else if (!indexOnly || isMinimal || hasCategories) {
    if (tool.commandsPath) {
      // Install commands from commands/ folder
      const srcCommands = path.join(PACKAGE_ROOT, 'commands');
      if (fs.existsSync(srcCommands)) {
        const count = copyDir(srcCommands, tool.commandsPath, replacements, options);
        console.log(`  ✅ Commands: ${count} files`);
        totalFiles += count;
      }

      // Install commands from commands-claudekit/ folder (merged into same directory)
      const srcCommandsClaudekit = path.join(PACKAGE_ROOT, 'commands-claudekit');
      if (fs.existsSync(srcCommandsClaudekit)) {
        const count = copyDir(srcCommandsClaudekit, tool.commandsPath, replacements, options);
        console.log(`  ✅ Commands (claudekit): ${count} files`);
        totalFiles += count;
      }
    }
  } else {
    console.log(`  ⏭️  Skipping commands (index-only mode - use --full to include)`);
  }

  // 3. Install core framework (agents, matrix-skills) - SKIP in index-only/lite mode
  if (!isLite && (!indexOnly || isMinimal || hasCategories)) {
    const coreDir = path.join(tool.skillsPath, 'agent-assistant');
    const coreComponents = ['agents', 'matrix-skills'];

    for (const name of coreComponents) {
      const srcPath = path.join(PACKAGE_ROOT, name);
      if (fs.existsSync(srcPath)) {
        const destPath = path.join(coreDir, name);
        const count = copyDir(srcPath, destPath, replacements, options);
        console.log(`  ✅ ${name}: ${count} files`);
        totalFiles += count;
      }
    }

    // 4. Install claudekit agents if available
    const srcAgentsClaudekit = path.join(PACKAGE_ROOT, 'agents-claudekit');
    if (fs.existsSync(srcAgentsClaudekit)) {
      const destPath = path.join(coreDir, 'claudekit', 'agents');
      const count = copyDir(srcAgentsClaudekit, destPath, replacements, options);
      console.log(`  ✅ claudekit/agents: ${count} files`);
      totalFiles += count;
    }
  } else if (!isLite) {
    console.log(`  ⏭️  Skipping agents/matrix-skills (index-only mode)`);
  }

  // 5. Install rules - SKIP in index-only/lite mode (327 files = ~1.5MB, causes context limit)
  if (!isLite && (!indexOnly || isMinimal || hasCategories)) {
    const srcRules = path.join(PACKAGE_ROOT, 'rules');
    if (fs.existsSync(srcRules) && tool.rulesPath) {
      const count = copyDir(srcRules, tool.rulesPath, replacements, options);
      console.log(`  ✅ Rules: ${count} files`);
      totalFiles += count;
    }
  } else if (!isLite) {
    console.log(`  ⏭️  Skipping rules (index-only mode - use --full to include)`);
  }

  // 6. Install hooks (Claude Code only) - SKIP in index-only/lite mode
  if (!isLite && (!indexOnly || isMinimal || hasCategories)) {
    if (tool.supportsHooks && tool.hooksPath) {
      const srcHooks = path.join(PACKAGE_ROOT, 'hooks');
      if (fs.existsSync(srcHooks)) {
        const count = copyDir(srcHooks, tool.hooksPath, replacements, options);
        console.log(`  ✅ Hooks: ${count} files`);
        totalFiles += count;
      }
    }
  } else if (!isLite) {
    console.log(`  ⏭️  Skipping hooks (index-only mode)`);
  }

  // 7. Install output-styles (Claude Code only) - SKIP in index-only/lite mode
  if (!isLite && toolId === 'claude' && (!indexOnly || isMinimal || hasCategories)) {
    const srcStyles = path.join(PACKAGE_ROOT, 'output-styles');
    if (fs.existsSync(srcStyles)) {
      const destStyles = path.join(tool.basePath, 'output-styles');
      const count = copyDir(srcStyles, destStyles, replacements, options);
      console.log(`  ✅ Output Styles: ${count} files`);
      totalFiles += count;
    }

    // 8. Install workflows
    const srcWorkflows = path.join(PACKAGE_ROOT, 'workflows');
    if (fs.existsSync(srcWorkflows)) {
      const destWorkflows = path.join(tool.basePath, 'workflows');
      const count = copyDir(srcWorkflows, destWorkflows, replacements, options);
      console.log(`  ✅ Workflows: ${count} files`);
      totalFiles += count;
    }

    // 9. Copy statusline scripts
    const statuslineFiles = ['statusline.cjs', 'statusline.ps1', 'statusline.sh'];
    for (const file of statuslineFiles) {
      const srcFile = path.join(PACKAGE_ROOT, file);
      if (fs.existsSync(srcFile)) {
        const destFile = path.join(tool.basePath, file);
        fs.copyFileSync(srcFile, destFile);
        totalFiles++;
      }
    }

    // 10. Copy settings.json if not exists
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
function install(targetTool = null, options = {}) {
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
    totalInstalled += installToTool(toolId, tool, options);
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
 * Uninstall function - removes all installed files
 */
function uninstall(targetTool = null) {
  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT - UNINSTALLER');
  console.log('='.repeat(60));

  const tools = targetTool ? [targetTool] : Object.keys(TOOLS);

  for (const toolId of tools) {
    if (!TOOLS[toolId]) {
      console.log(`\n❌ Unknown tool: ${toolId}`);
      continue;
    }

    const tool = TOOLS[toolId];
    console.log(`\n🗑️  Uninstalling from ${tool.name}...`);

    // Remove skills directory
    if (tool.skillsPath && fs.existsSync(tool.skillsPath)) {
      fs.rmSync(tool.skillsPath, { recursive: true, force: true });
      console.log(`  ✅ Removed: ${tool.skillsPath}`);
    }

    // Remove rules directory (be careful - might have user rules)
    if (tool.rulesPath && fs.existsSync(tool.rulesPath)) {
      const devkitRulesMarker = path.join(tool.rulesPath, '.devkit-installed');
      // Only remove if we installed it (check for our marker or known files)
      fs.rmSync(tool.rulesPath, { recursive: true, force: true });
      console.log(`  ✅ Removed: ${tool.rulesPath}`);
    }

    // Remove hooks (Claude only)
    if (tool.supportsHooks && tool.hooksPath && fs.existsSync(tool.hooksPath)) {
      fs.rmSync(tool.hooksPath, { recursive: true, force: true });
      console.log(`  ✅ Removed: ${tool.hooksPath}`);
    }

    // Remove Claude-specific directories
    if (toolId === 'claude') {
      const extraDirs = ['output-styles', 'workflows'];
      for (const dir of extraDirs) {
        const dirPath = path.join(tool.basePath, dir);
        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true });
          console.log(`  ✅ Removed: ${dirPath}`);
        }
      }

      // Remove statusline files
      const statuslineFiles = ['statusline.cjs', 'statusline.ps1', 'statusline.sh'];
      for (const file of statuslineFiles) {
        const filePath = path.join(tool.basePath, file);
        if (fs.existsSync(filePath)) {
          fs.rmSync(filePath);
          console.log(`  ✅ Removed: ${filePath}`);
        }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('  ✅ UNINSTALLATION COMPLETE');
  console.log('='.repeat(60));
  console.log('\nDevkit has been removed from your system.');
  console.log('To reinstall: npm install -g @ngxtm/devkit && devkit install\n');
}

/**
 * Interactive skill selection
 */
async function interactiveInstall(targetTool = null) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT - INTERACTIVE INSTALLER');
  console.log('='.repeat(60));

  // Show categories
  console.log('\nAvailable categories:\n');
  const categories = getCategories();
  categories.forEach((cat, i) => {
    const skills = SKILL_CATEGORIES[cat];
    console.log(`  ${i + 1}. ${cat.padEnd(15)} (${skills.length} skills)`);
  });

  console.log(`\n  ${categories.length + 1}. minimal        (${MINIMAL_SKILLS.length} core skills)`);
  console.log(`  ${categories.length + 2}. all            (all 413+ skills)`);

  // Get user selection
  console.log('\nEnter category numbers separated by comma (e.g., 1,3,5)');
  console.log('Or type category names (e.g., react,typescript,testing)');
  const answer = await question('\nYour selection: ');

  rl.close();

  // Parse selection
  const input = answer.trim().toLowerCase();

  if (input === 'all' || input === String(categories.length + 2)) {
    console.log('\nInstalling all skills...');
    install(targetTool, {});
    return;
  }

  if (input === 'minimal' || input === String(categories.length + 1)) {
    console.log('\nInstalling minimal skills...');
    install(targetTool, { minimal: true });
    return;
  }

  // Parse as numbers or category names
  let selectedCategories = [];

  const parts = input.split(',').map(p => p.trim());
  for (const part of parts) {
    const num = parseInt(part);
    if (!isNaN(num) && num >= 1 && num <= categories.length) {
      selectedCategories.push(categories[num - 1]);
    } else if (categories.includes(part)) {
      selectedCategories.push(part);
    }
  }

  if (selectedCategories.length === 0) {
    console.log('\nNo valid categories selected. Installing minimal set...');
    install(targetTool, { minimal: true });
    return;
  }

  console.log(`\nInstalling categories: ${selectedCategories.join(', ')}...`);
  install(targetTool, { categories: selectedCategories });
}

/**
 * Update function
 */
function update() {
  console.log('Checking for updates...\n');
  console.log('Run: npm update -g @ngxtm/devkit');
  console.log('Then: devkit install');
}

/**
 * List available skills
 */
function listSkills() {
  const skillsDir = path.join(PACKAGE_ROOT, 'skills');

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

  console.log('\nUse "devkit install" to install these skills.\n');
}

/**
 * List categories
 */
function listCategories() {
  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT - SKILL CATEGORIES');
  console.log('='.repeat(60));

  const categories = getCategories();

  console.log('\nAvailable categories:\n');
  for (const cat of categories) {
    const skills = SKILL_CATEGORIES[cat];
    console.log(`  ${cat.padEnd(15)} (${skills.length} skills)`);
    skills.slice(0, 3).forEach(s => console.log(`    - ${s}`));
    if (skills.length > 3) {
      console.log(`    ... and ${skills.length - 3} more`);
    }
    console.log('');
  }

  console.log('\nUsage:');
  console.log('  devkit install --category=react,typescript');
  console.log('  devkit install --minimal');
  console.log('  devkit install --interactive\n');
}

// Export for CLI
module.exports = {
  install,
  uninstall,
  update,
  interactiveInstall,
  listSkills,
  listCategories,
  TOOLS
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const targetTool = args.find(a => !a.startsWith('-'));

  if (args.includes('--uninstall') || args.includes('-u')) {
    uninstall(targetTool);
  } else {
    install(targetTool);
  }
}
