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
const { copyDir, getDirSize, parseJsonFile } = require('./utils');

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
 * Update devkit installation
 */
function updateProject(options = {}) {
  const projectDir = options.path || process.cwd();
  const claudeDir = path.join(projectDir, '.claude');
  const configPath = path.join(claudeDir, 'devkit.json');

  console.log('\n' + '='.repeat(60));
  console.log('  DEVKIT - UPDATE');
  console.log('='.repeat(60));

  // Check if devkit is installed
  if (!fs.existsSync(configPath)) {
    console.log('\n  No devkit installation found.');
    console.log('  Run: devkit init\n');
    return { success: false, reason: 'not_installed' };
  }

  // Read current config with error handling
  const config = parseJsonFile(configPath);
  if (!config) {
    console.log('\n  Error: devkit.json is corrupted.');
    console.log('  Try reinitializing with: devkit init --force\n');
    return { success: false, reason: 'corrupted_config' };
  }
  console.log(`\n  Current version: ${config.version}`);
  console.log(`  Installed: ${new Date(config.installedAt).toLocaleDateString()}`);

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
  const oldDetected = config.detectedTypes || [];

  // Find differences
  const added = newDetected.filter(t => !oldDetected.includes(t));
  const removed = oldDetected.filter(t => !newDetected.includes(t));
  const unchanged = newDetected.filter(t => oldDetected.includes(t));

  if (added.length > 0) {
    console.log(`  New tech detected: ${added.join(', ')}`);
  }
  if (removed.length > 0) {
    console.log(`  Removed: ${removed.join(', ')}`);
  }
  if (unchanged.length > 0) {
    console.log(`  Unchanged: ${unchanged.join(', ')}`);
  }
  if (added.length === 0 && removed.length === 0) {
    console.log('  No changes in detected technologies.');
  }

  // Update rules if needed
  if (added.length > 0 || options.force) {
    const newRules = getRulesForTypes(added);
    const rulesDir = path.join(claudeDir, 'rules');

    console.log('\n  Installing new rules...');

    for (const ruleType of newRules) {
      const srcRulesDir = path.join(PACKAGE_ROOT, 'templates', ruleType, 'rules');
      if (fs.existsSync(srcRulesDir)) {
        const destRulesDir = path.join(rulesDir, ruleType);
        const count = copyDir(srcRulesDir, destRulesDir);
        console.log(`    ${ruleType}: ${count} files`);
      }
    }
  }

  // Remove old rules if needed and user agrees
  if (removed.length > 0 && options.clean) {
    const rulesDir = path.join(claudeDir, 'rules');

    console.log('\n  Removing old rules...');

    for (const ruleType of removed) {
      const ruleDir = path.join(rulesDir, ruleType);
      if (fs.existsSync(ruleDir)) {
        fs.rmSync(ruleDir, { recursive: true, force: true });
        console.log(`    Removed: ${ruleType}`);
      }
    }
  }

  // Update commands if --force
  if (options.force) {
    console.log('\n  Updating commands...');
    const mergedCommandsDir = path.join(PACKAGE_ROOT, 'merged-commands');
    const commandsDir = path.join(claudeDir, 'commands');

    if (fs.existsSync(mergedCommandsDir)) {
      // Backup existing
      const backupDir = path.join(claudeDir, 'commands.backup');
      if (fs.existsSync(commandsDir)) {
        fs.renameSync(commandsDir, backupDir);
      }

      const count = copyDir(mergedCommandsDir, commandsDir);
      console.log(`    Commands: ${count} files`);

      // Remove backup
      if (fs.existsSync(backupDir)) {
        fs.rmSync(backupDir, { recursive: true, force: true });
      }
    }
  }

  // Update config
  const newConfig = {
    ...config,
    version: VERSION,
    detectedTypes: newDetected,
    installedRules: getRulesForTypes(newDetected),
    updatedAt: new Date().toISOString(),
    stats: {
      totalFiles: config.stats?.totalFiles || 0,
      sizeKB: Math.round(getDirSize(claudeDir) / 1024)
    }
  };

  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('  UPDATE COMPLETE');
  console.log('='.repeat(60));
  console.log(`\n  Size: ${newConfig.stats.sizeKB} KB`);
  console.log(`  Detected: ${newDetected.join(', ') || 'generic'}\n`);

  return {
    success: true,
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
