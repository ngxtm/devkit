#!/usr/bin/env node

/**
 * Devkit Init - Per-Project Installation
 *
 * Installs devkit to the current project with support for multiple AI tools:
 * - Claude Code, Cursor, GitHub Copilot, Gemini CLI
 * - Interactive tool selection with auto-detection
 * - Tech-specific rules (based on project detection)
 * - Merged commands and essential hooks
 */

const fs = require('fs');
const path = require('path');

const { detectProjectType, getRulesForTypes } = require('./detect');
const { copyDir, getDirSize, detectInstalledTools, TOOLS } = require('./utils');

const VERSION = require('../package.json').version;
const PACKAGE_ROOT = path.join(__dirname, '..');

/**
 * Show interactive tool selection menu
 * @param {Object} detectedTools - Results from detectInstalledTools()
 * @returns {Promise<string[]>} - Array of selected tool ids
 */
async function showToolSelectionMenu(detectedTools) {
  // Dynamic import for inquirer (ES module)
  const inquirer = (await import('inquirer')).default;

  console.log('\n  Detecting installed AI tools...\n');

  const choices = Object.entries(TOOLS).map(([id, tool]) => {
    const detected = detectedTools[id]?.detected;
    const status = detected ? '(detected)' : '(not detected)';
    return {
      name: `${tool.name} ${status}`,
      value: id,
      checked: detected // Pre-select detected tools
    };
  });

  const { selectedTools } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedTools',
      message: 'Select AI tools to install devkit for:',
      choices,
      validate: (answer) => {
        if (answer.length === 0) {
          return 'Please select at least one tool.';
        }
        return true;
      }
    }
  ]);

  return selectedTools;
}

/**
 * Install devkit for a single tool
 * @param {string} toolId - Tool identifier
 * @param {Object} tool - Tool configuration
 * @param {string} projectDir - Project directory
 * @param {Object} options - Install options
 * @returns {Object} - Installation result
 */
function installForTool(toolId, tool, projectDir, options = {}) {
  const targetDir = path.join(projectDir, tool.projectPath);
  let isUpdate = options.update || false;

  // Check if already exists - auto-update if so
  if (fs.existsSync(targetDir) && !isUpdate && !options.force) {
    const configPath = path.join(targetDir, 'devkit.json');
    if (fs.existsSync(configPath)) {
      // Already installed, auto-update instead of skipping
      isUpdate = true;
    }
  }

  // Create target directory
  fs.mkdirSync(targetDir, { recursive: true });

  let totalFiles = 0;
  const stats = {};

  // 1. Install core commands (if tool supports it) - optimized size ~400KB
  if (tool.commandsPath) {
    const coreCommandsDir = path.join(PACKAGE_ROOT, 'merged-commands');
    const commandsDir = path.join(targetDir, tool.commandsPath);

    if (fs.existsSync(coreCommandsDir)) {
      const count = copyDir(coreCommandsDir, commandsDir);
      stats.commands = count;
      totalFiles += count;
    }
  }

  // Note: Skills are loaded on-demand from skills-compact.json
  // Full skills are NOT copied to reduce installation size
  // User can run "devkit add-skills" to install specific skill packs

  // 2. Install rules
  if (tool.rulesPath && options.rules && options.rules.length > 0) {
    const rulesDir = path.join(targetDir, tool.rulesPath);
    let rulesCount = 0;

    for (const ruleType of options.rules) {
      const srcRulesDir = path.join(PACKAGE_ROOT, 'templates', ruleType, 'rules');
      if (fs.existsSync(srcRulesDir)) {
        const destRulesDir = path.join(rulesDir, ruleType);
        const count = copyDir(srcRulesDir, destRulesDir);
        rulesCount += count;
      }
    }

    if (rulesCount > 0) {
      stats.rules = rulesCount;
      totalFiles += rulesCount;
    }
  }

  // 3. Install hooks (if tool supports it)
  if (tool.supportsHooks && tool.hooksPath) {
    const srcHooksDir = path.join(PACKAGE_ROOT, 'templates', 'base', 'hooks');
    const hooksDir = path.join(targetDir, tool.hooksPath);

    if (fs.existsSync(srcHooksDir)) {
      const count = copyDir(srcHooksDir, hooksDir);
      stats.hooks = count;
      totalFiles += count;
    } else {
      const fallbackHooks = path.join(PACKAGE_ROOT, 'hooks');
      if (fs.existsSync(fallbackHooks)) {
        const count = copyDir(fallbackHooks, hooksDir);
        stats.hooks = count;
        totalFiles += count;
      }
    }
  }

  // 4. Install compact skill index (for auto-detection, ~20KB only)
  const compactIndex = path.join(PACKAGE_ROOT, 'skills-compact.json');
  if (fs.existsSync(compactIndex)) {
    fs.copyFileSync(compactIndex, path.join(targetDir, 'skills-compact.json'));
    totalFiles++;
  }

  // 5. Install base rules (including auto-skill detection)
  const baseRulesDir = path.join(PACKAGE_ROOT, 'templates', 'base', 'rules');
  if (tool.rulesPath && fs.existsSync(baseRulesDir)) {
    const destRulesDir = path.join(targetDir, tool.rulesPath, 'base');
    const count = copyDir(baseRulesDir, destRulesDir);
    totalFiles += count;
  }

  // 6. Create devkit.json tracking file
  const devkitConfig = {
    version: VERSION,
    tool: toolId,
    toolName: tool.name,
    detectedTypes: options.detectedTypes || [],
    installedRules: options.rules || [],
    installedAt: new Date().toISOString(),
    updatedAt: isUpdate ? new Date().toISOString() : null,
    stats: {
      totalFiles: totalFiles,
      sizeKB: Math.round(getDirSize(targetDir) / 1024)
    }
  };

  fs.writeFileSync(
    path.join(targetDir, 'devkit.json'),
    JSON.stringify(devkitConfig, null, 2)
  );
  totalFiles++;

  // 7. Create settings.json if not exists (for tools that use it)
  if (toolId === 'claude') {
    const settingsPath = path.join(targetDir, 'settings.json');
    if (!fs.existsSync(settingsPath)) {
      const settings = { includeCoAuthoredBy: false };
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
      totalFiles++;
    }
  }

  return {
    success: true,
    tool: toolId,
    toolName: tool.name,
    path: targetDir,
    stats: {
      files: totalFiles,
      sizeKB: Math.round(getDirSize(targetDir) / 1024),
      ...stats
    }
  };
}

/**
 * Initialize devkit in a project directory
 * @param {Object} options - Installation options
 */
async function initProject(options = {}) {
  const projectDir = options.path || process.cwd();
  const isUpdate = options.update || false;

  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT v' + VERSION + (isUpdate ? ' - UPDATE' : ' - INIT'));
  console.log('='.repeat(60));

  // Determine which tools to install
  let selectedTools = [];

  if (options.all) {
    // --all flag: install for all tools
    selectedTools = Object.keys(TOOLS);
    console.log('\n  Installing for all tools...');
  } else if (options.tools && options.tools.length > 0) {
    // Specific tools via --tools flag
    selectedTools = options.tools;
  } else {
    // Interactive mode: show selection menu
    const detectedTools = detectInstalledTools();
    selectedTools = await showToolSelectionMenu(detectedTools);
  }

  if (selectedTools.length === 0) {
    console.log('\n  No tools selected. Exiting.\n');
    return { success: false, reason: 'no_selection' };
  }

  // Detect project type
  console.log('\n  Detecting project type...');
  const detectedTypes = detectProjectType(projectDir);
  const rulesToInstall = getRulesForTypes(detectedTypes);

  if (detectedTypes.length > 0) {
    console.log(`  Detected: ${detectedTypes.join(', ')}`);
    console.log(`  Rules: ${rulesToInstall.join(', ')}`);
  } else {
    console.log('  No specific technology detected.');
    console.log('  Installing base commands only.');
  }

  // Install for each selected tool
  console.log('\n  Installing components...');
  const results = [];

  for (const toolId of selectedTools) {
    const tool = TOOLS[toolId];
    if (!tool) {
      console.log(`    [!] Unknown tool: ${toolId}`);
      continue;
    }

    const result = installForTool(toolId, tool, projectDir, {
      ...options,
      detectedTypes,
      rules: rulesToInstall
    });

    if (result.success) {
      console.log(`    [+] ${tool.name}: ${result.stats.files} files (${result.stats.sizeKB} KB)`);
    } else {
      console.log(`    [-] ${tool.name}: ${result.message || result.reason}`);
    }

    results.push(result);
  }

  // Summary
  const successCount = results.filter(r => r.success).length;
  const totalFiles = results.reduce((sum, r) => sum + (r.stats?.files || 0), 0);
  const totalSize = results.reduce((sum, r) => sum + (r.stats?.sizeKB || 0), 0);

  console.log('\n' + '='.repeat(60));
  if (successCount === 0) {
    console.log('  NO CHANGES MADE');
    console.log('='.repeat(60));
    console.log('\n  Try: devkit init --force');
  } else {
    console.log('  INSTALLATION COMPLETE');
    console.log('='.repeat(60));
  }
  console.log(`\n  Tools: ${successCount}/${selectedTools.length} installed`);
  console.log(`  Total: ${totalFiles} files (${totalSize} KB)`);

  // Show installed locations
  console.log('\n  Installed to:');
  for (const result of results) {
    if (result.success) {
      console.log(`    - ${result.path}`);
    }
  }

  console.log('\n  Available commands:');
  console.log('    /plan        - Plan implementation');
  console.log('    /cook        - Build a feature');
  console.log('    /fix         - Fix issues');
  console.log('    /code        - Start coding');
  console.log('    /brainstorm  - Brainstorm ideas');

  if (detectedTypes.length > 0) {
    console.log(`\n  Tech-specific rules loaded for: ${detectedTypes.join(', ')}`);
  }

  console.log('\n  Restart your AI tool to use the new skills.\n');

  return {
    success: successCount > 0,
    tools: results,
    detected: detectedTypes,
    rules: rulesToInstall,
    stats: {
      files: totalFiles,
      sizeKB: totalSize
    }
  };
}

/**
 * Uninstall devkit from project
 */
function uninstallProject(options = {}) {
  const projectDir = options.path || process.cwd();

  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT - UNINSTALL');
  console.log('='.repeat(60));

  let removedCount = 0;

  for (const [toolId, tool] of Object.entries(TOOLS)) {
    const targetDir = path.join(projectDir, tool.projectPath);
    const devkitConfig = path.join(targetDir, 'devkit.json');

    if (fs.existsSync(devkitConfig)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
      console.log(`  Removed: ${targetDir}`);
      removedCount++;
    }
  }

  if (removedCount === 0) {
    console.log('\n  No devkit installations found.\n');
    return { success: false, reason: 'not_found' };
  }

  console.log(`\n  Uninstalled ${removedCount} tool(s) successfully.\n`);
  return { success: true, removed: removedCount };
}

module.exports = {
  initProject,
  uninstallProject,
  installForTool,
  showToolSelectionMenu
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  // Parse --tools=claude,cursor format
  const toolsArg = args.find(a => a.startsWith('--tools='));
  const tools = toolsArg ? toolsArg.split('=')[1].split(',') : [];

  // Parse --path=value format
  const pathArg = args.find(a => a.startsWith('--path='));
  const pathValue = pathArg ? pathArg.split('=')[1] : null;

  // Fallback to positional argument (first non-flag argument)
  const positionalPath = args.find(a => !a.startsWith('-') && !a.includes('='));

  const options = {
    force: args.includes('--force') || args.includes('-f'),
    update: args.includes('--update') || args.includes('-u'),
    all: args.includes('--all') || args.includes('-a'),
    tools: tools,
    path: pathValue || positionalPath || process.cwd()
  };

  if (args.includes('--uninstall')) {
    uninstallProject(options);
  } else {
    initProject(options).catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
  }
}
