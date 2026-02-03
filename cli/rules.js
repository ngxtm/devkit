/**
 * Rules Management
 *
 * Add/remove rules manually for projects where auto-detection
 * doesn't cover all needs.
 */

const fs = require('fs');
const path = require('path');
const { copyDir } = require('./utils');

const PACKAGE_ROOT = path.join(__dirname, '..');

/**
 * Get all available rules from the rules/ directory
 */
function getAvailableRules() {
  const rulesDir = path.join(PACKAGE_ROOT, 'rules');

  if (!fs.existsSync(rulesDir)) {
    return [];
  }

  return fs.readdirSync(rulesDir).filter(item => {
    const itemPath = path.join(rulesDir, item);
    return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
  });
}

/**
 * Get installed rules from devkit.json
 */
function getInstalledRules(projectDir) {
  const configPath = path.join(projectDir, '.claude', 'devkit.json');

  if (!fs.existsSync(configPath)) {
    return { rules: [], manualRules: [] };
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return {
      rules: config.installedRules || [],
      manualRules: config.manualRules || [],
      detectedTypes: config.detectedTypes || []
    };
  } catch (e) {
    return { rules: [], manualRules: [] };
  }
}

/**
 * Update devkit.json with new rules
 */
function updateDevkitConfig(projectDir, updates) {
  const configPath = path.join(projectDir, '.claude', 'devkit.json');

  if (!fs.existsSync(configPath)) {
    console.log('  No devkit.json found. Run "devkit init" first.');
    return false;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  Object.assign(config, updates, { updatedAt: new Date().toISOString() });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return true;
}

/**
 * List all available rules
 */
function listRules(options = {}) {
  const projectDir = options.path || process.cwd();
  const available = getAvailableRules();
  const { rules: installed, manualRules } = getInstalledRules(projectDir);
  const allInstalled = [...new Set([...installed, ...manualRules])];

  console.log('\n' + '='.repeat(50));
  console.log('  AVAILABLE RULES');
  console.log('='.repeat(50));

  if (options.installed) {
    // Show only installed rules
    console.log('\nInstalled in this project:');
    if (allInstalled.length === 0) {
      console.log('  (none)');
    } else {
      allInstalled.forEach(rule => {
        const isManual = manualRules.includes(rule);
        console.log(`  - ${rule}${isManual ? ' (manual)' : ' (auto-detected)'}`);
      });
    }
  } else {
    // Show all available rules
    console.log(`\nTotal: ${available.length} rules\n`);
    available.forEach(rule => {
      const isInstalled = allInstalled.includes(rule);
      const marker = isInstalled ? '[x]' : '[ ]';
      console.log(`  ${marker} ${rule}`);
    });

    console.log('\n  [x] = installed in current project');
  }

  console.log('');
  return { available, installed: allInstalled };
}

/**
 * Add rules to project
 */
function addRules(ruleNames, options = {}) {
  const projectDir = options.path || process.cwd();
  const claudeDir = path.join(projectDir, '.claude');

  if (!fs.existsSync(claudeDir)) {
    console.log('\n  No .claude/ folder found. Run "devkit init" first.\n');
    return { success: false, reason: 'not_initialized' };
  }

  const available = getAvailableRules();
  const { rules: autoRules, manualRules = [] } = getInstalledRules(projectDir);
  const allInstalled = [...new Set([...autoRules, ...manualRules])];

  console.log('\n' + '='.repeat(50));
  console.log('  ADD RULES');
  console.log('='.repeat(50));

  const added = [];
  const skipped = [];
  const notFound = [];

  for (const ruleName of ruleNames) {
    const rule = ruleName.toLowerCase();

    if (!available.includes(rule)) {
      notFound.push(rule);
      console.log(`  [!] ${rule} - not found`);
      continue;
    }

    if (allInstalled.includes(rule)) {
      skipped.push(rule);
      console.log(`  [-] ${rule} - already installed`);
      continue;
    }

    // Copy rule files
    const srcDir = path.join(PACKAGE_ROOT, 'rules', rule);
    const destDir = path.join(claudeDir, 'rules', rule);

    if (fs.existsSync(srcDir)) {
      const count = copyDir(srcDir, destDir);
      added.push(rule);
      console.log(`  [+] ${rule} - added (${count} files)`);
    }
  }

  // Update devkit.json
  if (added.length > 0) {
    const newManualRules = [...new Set([...manualRules, ...added])];
    updateDevkitConfig(projectDir, { manualRules: newManualRules });
  }

  // Summary
  console.log('\n' + '-'.repeat(50));
  if (added.length > 0) {
    console.log(`  Added: ${added.join(', ')}`);
  }
  if (skipped.length > 0) {
    console.log(`  Skipped (already installed): ${skipped.join(', ')}`);
  }
  if (notFound.length > 0) {
    console.log(`  Not found: ${notFound.join(', ')}`);
    console.log(`  Run "devkit rules" to see available rules.`);
  }
  console.log('');

  return { success: true, added, skipped, notFound };
}

/**
 * Remove rules from project
 */
function removeRules(ruleNames, options = {}) {
  const projectDir = options.path || process.cwd();
  const claudeDir = path.join(projectDir, '.claude');

  if (!fs.existsSync(claudeDir)) {
    console.log('\n  No .claude/ folder found.\n');
    return { success: false, reason: 'not_initialized' };
  }

  const { rules: autoRules, manualRules = [] } = getInstalledRules(projectDir);

  console.log('\n' + '='.repeat(50));
  console.log('  REMOVE RULES');
  console.log('='.repeat(50));

  const removed = [];
  const notInstalled = [];

  for (const ruleName of ruleNames) {
    const rule = ruleName.toLowerCase();
    const ruleDir = path.join(claudeDir, 'rules', rule);

    if (!fs.existsSync(ruleDir)) {
      notInstalled.push(rule);
      console.log(`  [-] ${rule} - not installed`);
      continue;
    }

    // Remove rule directory
    fs.rmSync(ruleDir, { recursive: true, force: true });
    removed.push(rule);
    console.log(`  [x] ${rule} - removed`);
  }

  // Update devkit.json
  if (removed.length > 0) {
    const newAutoRules = autoRules.filter(r => !removed.includes(r));
    const newManualRules = manualRules.filter(r => !removed.includes(r));
    updateDevkitConfig(projectDir, {
      installedRules: newAutoRules,
      manualRules: newManualRules
    });
  }

  // Summary
  console.log('\n' + '-'.repeat(50));
  if (removed.length > 0) {
    console.log(`  Removed: ${removed.join(', ')}`);
  }
  if (notInstalled.length > 0) {
    console.log(`  Not installed: ${notInstalled.join(', ')}`);
  }
  console.log('');

  return { success: true, removed, notInstalled };
}

module.exports = {
  getAvailableRules,
  getInstalledRules,
  listRules,
  addRules,
  removeRules
};
