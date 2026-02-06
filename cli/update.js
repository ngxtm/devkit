#!/usr/bin/env node

/**
 * Devkit Update - Update existing installation
 *
 * Re-detects project type and updates rules accordingly.
 * Preserves user customizations where possible.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { detectProjectType, getRulesForTypes } = require('./detect');
const { initProject } = require('./init');
const { copyDir, getDirSize, parseJsonFile, TOOLS } = require('./utils');

const VERSION = require('../package.json').version;
const PACKAGE_ROOT = path.join(__dirname, '..');

/**
 * Check for npm package updates
 */
function checkForUpdates() {
  try {
    const result = execSync('npm view @ngxtm/devkit version', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.trim();
  } catch (e) {
    return null;
  }
}

/**
 * Update a single tool installation
 * @param {string} toolId - Tool identifier
 * @param {Object} tool - Tool configuration
 * @param {string} projectDir - Project directory
 * @param {Object} options - Update options
 * @returns {Object} - Update result
 */
function updateToolInstallation(toolId, tool, projectDir, options = {}) {
  const targetDir = path.join(projectDir, tool.projectPath);
  const configPath = path.join(targetDir, 'devkit.json');

  if (!fs.existsSync(configPath)) {
    return { success: false, reason: 'not_installed' };
  }

  const config = parseJsonFile(configPath);
  if (!config) {
    return { success: false, reason: 'corrupted_config' };
  }

  let updatedCount = 0;

  // 1. Update commands (if tool supports it)
  if (tool.commandsPath) {
    const mergedCommandsDir = path.join(PACKAGE_ROOT, 'merged-commands');
    const commandsDir = path.join(targetDir, tool.commandsPath);
    if (fs.existsSync(mergedCommandsDir)) {
      updatedCount += copyDir(mergedCommandsDir, commandsDir);
    }
  }

  // 2. Update rules
  if (tool.rulesPath && options.rules && options.rules.length > 0) {
    const rulesDir = path.join(targetDir, tool.rulesPath);
    for (const ruleType of options.rules) {
      const srcRulesDir = path.join(PACKAGE_ROOT, 'templates', ruleType, 'rules');
      if (fs.existsSync(srcRulesDir)) {
        const destRulesDir = path.join(rulesDir, ruleType);
        updatedCount += copyDir(srcRulesDir, destRulesDir);
      }
    }
  }

  // 3. Remove old rules (if clean enabled)
  if (tool.rulesPath && options.removedRules && options.removedRules.length > 0 && options.clean !== false) {
    const rulesDir = path.join(targetDir, tool.rulesPath);
    for (const ruleType of options.removedRules) {
      const ruleDir = path.join(rulesDir, ruleType);
      if (fs.existsSync(ruleDir)) {
        fs.rmSync(ruleDir, { recursive: true, force: true });
      }
    }
  }

  // 4. Update hooks (if tool supports it)
  if (tool.supportsHooks && tool.hooksPath) {
    const srcHooksDir = path.join(PACKAGE_ROOT, 'hooks');
    const hooksDir = path.join(targetDir, tool.hooksPath);
    if (fs.existsSync(srcHooksDir)) {
      updatedCount += copyDir(srcHooksDir, hooksDir);
    }
  }

  // 5. Update skills index files
  const indexFiles = [
    'skills-index.json',
    'skills-keywords.json',
    'skills-categories.json',
    'skills-triggers.json'
  ];
  for (const indexFile of indexFiles) {
    const src = path.join(PACKAGE_ROOT, indexFile);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(targetDir, indexFile));
      updatedCount++;
    }
  }

  // 6. Update base rules (including auto-skill detection)
  const baseRulesDir = path.join(PACKAGE_ROOT, 'templates', 'base', 'rules');
  if (tool.rulesPath && fs.existsSync(baseRulesDir)) {
    const destRulesDir = path.join(targetDir, tool.rulesPath, 'base');
    updatedCount += copyDir(baseRulesDir, destRulesDir);
  }

  // 7. Update devkit.json
  const newConfig = {
    ...config,
    version: VERSION,
    detectedTypes: options.detectedTypes || config.detectedTypes,
    installedRules: options.allRules || config.installedRules,
    updatedAt: new Date().toISOString(),
    stats: {
      totalFiles: config.stats?.totalFiles || 0,
      sizeKB: Math.round(getDirSize(targetDir) / 1024)
    }
  };
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));

  return {
    success: true,
    tool: toolId,
    toolName: tool.name,
    path: targetDir,
    updatedFiles: updatedCount,
    sizeKB: newConfig.stats.sizeKB
  };
}

/**
 * Update devkit installation for all installed tools
 */
function updateProject(options = {}) {
  const projectDir = options.path || process.cwd();

  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT - UPDATE');
  console.log('='.repeat(60));

  // Find all installed tools
  const installedTools = [];
  let primaryConfig = null;

  for (const [toolId, tool] of Object.entries(TOOLS)) {
    const targetDir = path.join(projectDir, tool.projectPath);
    const configPath = path.join(targetDir, 'devkit.json');
    if (fs.existsSync(configPath)) {
      const config = parseJsonFile(configPath);
      if (config) {
        installedTools.push({ toolId, tool, config });
        if (!primaryConfig) primaryConfig = config;
      }
    }
  }

  if (installedTools.length === 0) {
    console.log('\n  No devkit installation found.');
    console.log('  Run: devkit init\n');
    return { success: false, reason: 'not_installed' };
  }

  console.log(`\n  Found ${installedTools.length} tool(s): ${installedTools.map(t => t.tool.name).join(', ')}`);
  console.log(`  Current version: ${primaryConfig.version}`);

  // Check for package updates
  console.log('\n  Checking for updates...');
  const latestVersion = checkForUpdates();

  if (latestVersion && latestVersion !== VERSION) {
    console.log(`  New version available: ${latestVersion}`);
    console.log('  Run: npm update -g @ngxtm/devkit');
    console.log('  Then: devkit update\n');
  } else if (latestVersion) {
    console.log(`  Package is up to date (${VERSION})`);
  } else {
    console.log('  Could not check for updates (offline?)');
  }

  // Re-detect project type
  console.log('\n  Re-detecting project type...');
  const newDetected = detectProjectType(projectDir);
  const oldDetected = primaryConfig.detectedTypes || [];

  // Find differences
  const added = newDetected.filter(t => !oldDetected.includes(t));
  const removed = oldDetected.filter(t => !newDetected.includes(t));

  if (added.length > 0) {
    console.log(`  New tech detected: ${added.join(', ')}`);
  }
  if (removed.length > 0) {
    console.log(`  Removed: ${removed.join(', ')}`);
  }
  if (added.length === 0 && removed.length === 0) {
    console.log('  No changes in detected technologies.');
  }

  // Get all rules to install
  const allRules = getRulesForTypes(newDetected);
  const newRules = getRulesForTypes(added);

  // Update each tool
  console.log('\n  Updating installations...');
  const results = [];

  for (const { toolId, tool } of installedTools) {
    const result = updateToolInstallation(toolId, tool, projectDir, {
      ...options,
      rules: newRules,
      removedRules: removed,
      allRules,
      detectedTypes: newDetected
    });

    if (result.success) {
      console.log(`    [+] ${tool.name}: ${result.updatedFiles} files (${result.sizeKB} KB)`);
    } else {
      console.log(`    [-] ${tool.name}: ${result.reason}`);
    }

    results.push(result);
  }

  // Summary
  const successCount = results.filter(r => r.success).length;
  const totalSize = results.reduce((sum, r) => sum + (r.sizeKB || 0), 0);

  console.log('\n' + '='.repeat(60));
  console.log('  UPDATE COMPLETE');
  console.log('='.repeat(60));
  console.log(`\n  Tools updated: ${successCount}/${installedTools.length}`);
  console.log(`  Total size: ${totalSize} KB`);
  console.log(`  Detected: ${newDetected.join(', ') || 'generic'}\n`);

  return {
    success: successCount > 0,
    tools: results,
    added,
    removed,
    detected: newDetected
  };
}

/**
 * Show project status
 */
function showStatus(options = {}) {
  const projectDir = options.path || process.cwd();
  const claudeDir = path.join(projectDir, '.claude');
  const configPath = path.join(claudeDir, 'devkit.json');

  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT - STATUS');
  console.log('='.repeat(60));

  if (!fs.existsSync(configPath)) {
    console.log('\n  No devkit installation found.');
    console.log('  Run: devkit init\n');
    return { installed: false };
  }

  const config = parseJsonFile(configPath);
  if (!config) {
    console.log('\n  Error: devkit.json is corrupted.');
    console.log('  Try reinitializing with: devkit init --force\n');
    return { installed: false, corrupted: true };
  }

  console.log(`\n  Version: ${config.version}`);
  console.log(`  Installed: ${new Date(config.installedAt).toLocaleDateString()}`);
  if (config.updatedAt) {
    console.log(`  Updated: ${new Date(config.updatedAt).toLocaleDateString()}`);
  }
  console.log(`\n  Detected: ${config.detectedTypes?.join(', ') || 'none'}`);
  console.log(`  Rules: ${config.installedRules?.join(', ') || 'none'}`);
  console.log(`  Size: ${config.stats?.sizeKB || 'unknown'} KB\n`);

  return { installed: true, config };
}

module.exports = {
  updateProject,
  showStatus,
  checkForUpdates
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    force: args.includes('--force') || args.includes('-f'),
    clean: args.includes('--clean') || args.includes('-c'),
    path: args.find(a => !a.startsWith('-')) || process.cwd()
  };

  if (args.includes('--status')) {
    showStatus(options);
  } else {
    updateProject(options);
  }
}
