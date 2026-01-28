#!/usr/bin/env node

/**
 * Organize Rules Script
 *
 * Reorganizes rules from rules/ into templates/{tech}/rules/
 * This enables per-project installation of only relevant rules.
 */

const fs = require('fs');
const path = require('path');

const PACKAGE_ROOT = path.join(__dirname, '..');
const RULES_DIR = path.join(PACKAGE_ROOT, 'rules');
const TEMPLATES_DIR = path.join(PACKAGE_ROOT, 'templates');

/**
 * Mapping from rules subdirectory to template tech
 */
const RULES_MAPPING = {
  'flutter': 'flutter',
  'dart': 'dart',
  'golang': 'golang',
  'python': 'python',
  'react': 'react',
  'nextjs': 'nextjs',
  'nestjs': 'nestjs',
  'typescript': 'typescript',
  'javascript': 'javascript',
  'nodejs': 'nodejs',
  'prisma': 'prisma',
  'supabase': 'supabase',
  'tailwind': 'tailwind',
  'docker': 'docker',
  'java': 'java',
  'rust': 'rust',
  'vue': 'vue',
  'angular': 'angular',
  'svelte': 'svelte'
};

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return 0;

  fs.mkdirSync(dest, { recursive: true });
  let count = 0;

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === '__tests__') continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }

  return count;
}

/**
 * Get directory size in KB
 */
function getDirSize(dir) {
  if (!fs.existsSync(dir)) return 0;

  let size = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      size += getDirSize(entryPath);
    } else {
      size += fs.statSync(entryPath).size;
    }
  }

  return size;
}

/**
 * Organize rules into templates
 */
function organizeRules() {
  console.log('\n' + '='.repeat(60));
  console.log('  ORGANIZE RULES INTO TEMPLATES');
  console.log('='.repeat(60));

  if (!fs.existsSync(RULES_DIR)) {
    console.log('\nNo rules directory found.\n');
    return;
  }

  // Get all subdirectories in rules/
  const rulesDirs = fs.readdirSync(RULES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const stats = {};

  for (const ruleDir of rulesDirs) {
    const srcDir = path.join(RULES_DIR, ruleDir);
    const tech = RULES_MAPPING[ruleDir] || ruleDir;
    const destDir = path.join(TEMPLATES_DIR, tech, 'rules', ruleDir);

    // Copy rules
    const count = copyDir(srcDir, destDir);
    const sizeKB = Math.round(getDirSize(destDir) / 1024);

    stats[tech] = stats[tech] || { files: 0, sizeKB: 0 };
    stats[tech].files += count;
    stats[tech].sizeKB += sizeKB;
  }

  // Print stats
  console.log('\nTemplates created:\n');
  for (const [tech, data] of Object.entries(stats).sort()) {
    console.log(`  ${tech.padEnd(15)} ${String(data.files).padStart(4)} files  ${String(data.sizeKB).padStart(5)} KB`);
  }

  const totalFiles = Object.values(stats).reduce((sum, s) => sum + s.files, 0);
  const totalSize = Object.values(stats).reduce((sum, s) => sum + s.sizeKB, 0);
  console.log(`  ${'─'.repeat(35)}`);
  console.log(`  ${'TOTAL'.padEnd(15)} ${String(totalFiles).padStart(4)} files  ${String(totalSize).padStart(5)} KB`);

  console.log('\n' + '='.repeat(60) + '\n');

  return stats;
}

/**
 * Create base template with essential hooks
 */
function createBaseTemplate() {
  const baseDir = path.join(TEMPLATES_DIR, 'base');
  const hooksDir = path.join(baseDir, 'hooks');

  fs.mkdirSync(hooksDir, { recursive: true });

  // Copy essential hooks
  const srcHooks = path.join(PACKAGE_ROOT, 'hooks');
  if (fs.existsSync(srcHooks)) {
    // Copy only essential hooks (not the full set)
    const essentialHooks = [
      'privacy-block.cjs',
      'lib'
    ];

    for (const hook of essentialHooks) {
      const srcPath = path.join(srcHooks, hook);
      const destPath = path.join(hooksDir, hook);

      if (fs.existsSync(srcPath)) {
        if (fs.statSync(srcPath).isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
  }

  console.log('  Created base template with essential hooks');
}

/**
 * Generate rules-index.json
 */
function generateRulesIndex() {
  const index = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    templates: {}
  };

  if (!fs.existsSync(TEMPLATES_DIR)) {
    return index;
  }

  const templates = fs.readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'base')
    .map(d => d.name);

  for (const template of templates) {
    const rulesDir = path.join(TEMPLATES_DIR, template, 'rules');
    if (!fs.existsSync(rulesDir)) continue;

    const rules = fs.readdirSync(rulesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    const sizeKB = Math.round(getDirSize(rulesDir) / 1024);

    index.templates[template] = {
      path: `templates/${template}/rules`,
      rules: rules,
      sizeKB: sizeKB
    };
  }

  // Write index
  const indexPath = path.join(PACKAGE_ROOT, 'rules-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`  Generated rules-index.json`);

  return index;
}

// Run if called directly
if (require.main === module) {
  organizeRules();
  createBaseTemplate();
  generateRulesIndex();
}

module.exports = { organizeRules, createBaseTemplate, generateRulesIndex };
