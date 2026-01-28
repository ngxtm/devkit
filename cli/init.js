#!/usr/bin/env node

/**
 * Devkit Init - Per-Project Installation
 *
 * Installs devkit to the current project's .claude/ directory with:
 * - Merged commands (from both agent-assistant and claudekit)
 * - Tech-specific rules (based on project detection)
 * - Skills index (for on-demand loading)
 * - Essential hooks
 */

const fs = require('fs');
const path = require('path');

const { detectProjectType, getRulesForTypes, printDetectionResults } = require('./detect');
const { copyDir, getDirSize, validatePath } = require('./utils');

const VERSION = require('../package.json').version;
const PACKAGE_ROOT = path.join(__dirname, '..');

/**
 * Initialize devkit in a project directory
 */
function initProject(options = {}) {
  const projectDir = options.path || process.cwd();
  const claudeDir = path.join(projectDir, '.claude');
  const isUpdate = options.update || false;

  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT v' + VERSION + (isUpdate ? ' - UPDATE' : ' - INIT'));
  console.log('='.repeat(60));

  // Check if .claude already exists
  if (fs.existsSync(claudeDir) && !isUpdate && !options.force) {
    console.log(`\n  .claude/ folder already exists.`);
    console.log('  Use --force to overwrite or --update to update.\n');
    return { success: false, reason: 'exists' };
  }

  // 1. Detect project type
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

  // Create .claude directory
  fs.mkdirSync(claudeDir, { recursive: true });

  let totalFiles = 0;
  const stats = {};

  // 2. Install merged commands
  console.log('\n  Installing components...');
  const mergedCommandsDir = path.join(PACKAGE_ROOT, 'merged-commands');
  const commandsDir = path.join(claudeDir, 'commands');

  if (fs.existsSync(mergedCommandsDir)) {
    const count = copyDir(mergedCommandsDir, commandsDir);
    stats.commands = count;
    totalFiles += count;
    console.log(`    Commands: ${count} files`);
  } else {
    // Fallback to commands-claudekit if merged not available
    const fallbackDir = path.join(PACKAGE_ROOT, 'commands-claudekit');
    if (fs.existsSync(fallbackDir)) {
      const count = copyDir(fallbackDir, commandsDir);
      stats.commands = count;
      totalFiles += count;
      console.log(`    Commands (claudekit): ${count} files`);
    }
  }

  // 3. Install tech-specific rules
  const rulesDir = path.join(claudeDir, 'rules');
  let rulesCount = 0;

  for (const ruleType of rulesToInstall) {
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
    console.log(`    Rules: ${rulesCount} files (${rulesToInstall.join(', ')})`);
  }

  // 4. Install essential hooks
  const srcHooksDir = path.join(PACKAGE_ROOT, 'templates', 'base', 'hooks');
  const hooksDir = path.join(claudeDir, 'hooks');

  if (fs.existsSync(srcHooksDir)) {
    const count = copyDir(srcHooksDir, hooksDir);
    stats.hooks = count;
    totalFiles += count;
    console.log(`    Hooks: ${count} files`);
  } else {
    // Fallback to main hooks directory (essential only)
    const fallbackHooks = path.join(PACKAGE_ROOT, 'hooks');
    if (fs.existsSync(fallbackHooks)) {
      const count = copyDir(fallbackHooks, hooksDir);
      stats.hooks = count;
      totalFiles += count;
      console.log(`    Hooks: ${count} files`);
    }
  }

  // 5. Install skills index
  const skillsIndexSrc = path.join(PACKAGE_ROOT, 'skills-index.json');
  const skillsIndexDest = path.join(claudeDir, 'skills-index.json');

  if (fs.existsSync(skillsIndexSrc)) {
    fs.copyFileSync(skillsIndexSrc, skillsIndexDest);
    totalFiles++;
    console.log(`    Skills Index: 1 file`);
  }

  // 6. Create devkit.json tracking file
  const devkitConfig = {
    version: VERSION,
    detectedTypes: detectedTypes,
    installedRules: rulesToInstall,
    installedAt: new Date().toISOString(),
    updatedAt: isUpdate ? new Date().toISOString() : null,
    stats: {
      totalFiles: totalFiles,
      sizeKB: Math.round(getDirSize(claudeDir) / 1024)
    }
  };

  fs.writeFileSync(
    path.join(claudeDir, 'devkit.json'),
    JSON.stringify(devkitConfig, null, 2)
  );
  totalFiles++;

  // 7. Create settings.json if not exists
  const settingsPath = path.join(claudeDir, 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    const settings = {
      includeCoAuthoredBy: false
    };
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    totalFiles++;
  }

  // Calculate total size
  const totalSizeKB = Math.round(getDirSize(claudeDir) / 1024);

  console.log('\n' + '='.repeat(60));
  console.log('  INSTALLATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`\n  Total: ${totalFiles} files (${totalSizeKB} KB)`);
  console.log(`  Location: ${claudeDir}`);

  console.log('\n  Available commands:');
  console.log('    /plan        - Plan implementation');
  console.log('    /cook        - Build a feature');
  console.log('    /fix         - Fix issues');
  console.log('    /code        - Start coding');
  console.log('    /brainstorm  - Brainstorm ideas');

  if (detectedTypes.length > 0) {
    console.log(`\n  Tech-specific rules loaded for: ${detectedTypes.join(', ')}`);
  }

  console.log('\n  Restart Claude Code to use the new skills.\n');

  return {
    success: true,
    detected: detectedTypes,
    rules: rulesToInstall,
    stats: {
      files: totalFiles,
      sizeKB: totalSizeKB
    }
  };
}

/**
 * Uninstall devkit from project
 */
function uninstallProject(options = {}) {
  const projectDir = options.path || process.cwd();
  const claudeDir = path.join(projectDir, '.claude');

  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT - UNINSTALL');
  console.log('='.repeat(60));

  if (!fs.existsSync(claudeDir)) {
    console.log('\n  No .claude/ folder found.\n');
    return { success: false, reason: 'not_found' };
  }

  // Check if it's a devkit installation
  const devkitConfig = path.join(claudeDir, 'devkit.json');
  if (!fs.existsSync(devkitConfig)) {
    console.log('\n  .claude/ exists but is not a devkit installation.');
    console.log('  Remove manually if needed.\n');
    return { success: false, reason: 'not_devkit' };
  }

  // Remove the directory
  fs.rmSync(claudeDir, { recursive: true, force: true });
  console.log(`\n  Removed: ${claudeDir}`);
  console.log('  Devkit uninstalled successfully.\n');

  return { success: true };
}

module.exports = {
  initProject,
  uninstallProject,
  copyDir,
  getDirSize
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    force: args.includes('--force') || args.includes('-f'),
    update: args.includes('--update') || args.includes('-u'),
    path: args.find(a => !a.startsWith('-')) || process.cwd()
  };

  if (args.includes('--uninstall')) {
    uninstallProject(options);
  } else {
    initProject(options);
  }
}
