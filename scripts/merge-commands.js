#!/usr/bin/env node

/**
 * Merge Commands Script
 *
 * Merges commands from two sources:
 * - commands/ (agent-assistant style)
 * - commands-claudekit/ (claudekit style)
 *
 * Strategy:
 * 1. For conflicting commands, prefer claudekit (more sophisticated)
 * 2. For sub-commands, merge all unique sub-commands from both sources
 * 3. For unique commands, copy as-is
 */

const fs = require('fs');
const path = require('path');

const PACKAGE_ROOT = path.join(__dirname, '..');
const COMMANDS_DIR = path.join(PACKAGE_ROOT, 'commands');
const COMMANDS_CLAUDEKIT_DIR = path.join(PACKAGE_ROOT, 'commands-claudekit');
const MERGED_DIR = path.join(PACKAGE_ROOT, 'merged-commands');

/**
 * Merge strategy for conflicting commands
 * - 'claudekit': Use claudekit version
 * - 'agent': Use agent-assistant version
 * - 'merge': Merge both (claudekit base, add agent sub-commands)
 */
const MERGE_STRATEGY = {
  // Prefer claudekit for these (more sophisticated)
  'ask.md': 'claudekit',
  'bootstrap.md': 'claudekit',
  'ck-help.md': 'claudekit',
  'coding-level.md': 'claudekit',
  'debug.md': 'claudekit',
  'journal.md': 'claudekit',
  'kanban.md': 'claudekit',
  'preview.md': 'claudekit',
  'scout.md': 'claudekit',
  'use-mcp.md': 'claudekit',
  'watzup.md': 'claudekit',
  'worktree.md': 'claudekit',

  // Prefer agent-assistant for these
  'auto.md': 'agent',
  'deploy.md': 'agent',

  // Merge both for these (combine sub-commands)
  'brainstorm.md': 'merge',
  'code.md': 'merge',
  'cook.md': 'merge',
  'design.md': 'merge',
  'docs.md': 'merge',
  'fix.md': 'merge',
  'plan.md': 'merge',
  'review.md': 'merge',
  'test.md': 'merge'
};

/**
 * For merged commands, which source provides the base .md file
 */
const MERGE_BASE = {
  'brainstorm.md': 'claudekit',
  'code.md': 'claudekit',
  'cook.md': 'claudekit',
  'design.md': 'agent',
  'docs.md': 'claudekit',
  'fix.md': 'claudekit',
  'plan.md': 'claudekit',
  'review.md': 'agent',
  'test.md': 'claudekit'
};

/**
 * Get all files and directories from a path recursively
 */
function getAllEntries(dir, basePath = '') {
  const entries = { files: [], dirs: [] };

  if (!fs.existsSync(dir)) return entries;

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const relativePath = path.join(basePath, item.name);

    if (item.isDirectory()) {
      entries.dirs.push(relativePath);
      const subEntries = getAllEntries(path.join(dir, item.name), relativePath);
      entries.files.push(...subEntries.files);
      entries.dirs.push(...subEntries.dirs);
    } else {
      entries.files.push(relativePath);
    }
  }

  return entries;
}

/**
 * Copy file with directory creation
 */
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
}

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return 0;

  fs.mkdirSync(dest, { recursive: true });
  let count = 0;

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
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
 * Merge commands from both sources
 */
function mergeCommands() {
  console.log('\n' + '='.repeat(60));
  console.log('  MERGE COMMANDS');
  console.log('='.repeat(60));

  // Clean merged directory
  if (fs.existsSync(MERGED_DIR)) {
    fs.rmSync(MERGED_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(MERGED_DIR, { recursive: true });

  const agentEntries = getAllEntries(COMMANDS_DIR);
  const claudekitEntries = getAllEntries(COMMANDS_CLAUDEKIT_DIR);

  // Collect all unique files and dirs
  const allFiles = new Set([...agentEntries.files, ...claudekitEntries.files]);
  const processedDirs = new Set();

  let copiedFromAgent = 0;
  let copiedFromClaudekit = 0;
  let merged = 0;

  // Process each file
  for (const relativePath of allFiles) {
    const fileName = path.basename(relativePath);
    const dirName = path.dirname(relativePath);

    // Check if this is a root-level command file
    const isRootCommand = dirName === '.';
    const commandName = isRootCommand ? fileName : path.basename(dirName) + '.md';

    const agentPath = path.join(COMMANDS_DIR, relativePath);
    const claudekitPath = path.join(COMMANDS_CLAUDEKIT_DIR, relativePath);
    const mergedPath = path.join(MERGED_DIR, relativePath);

    const existsInAgent = fs.existsSync(agentPath);
    const existsInClaudekit = fs.existsSync(claudekitPath);

    // Determine source
    if (existsInAgent && existsInClaudekit) {
      // Both have this file - apply strategy
      const strategy = MERGE_STRATEGY[fileName] || MERGE_STRATEGY[commandName];

      if (strategy === 'agent') {
        copyFile(agentPath, mergedPath);
        copiedFromAgent++;
      } else if (strategy === 'claudekit' || strategy === 'merge' || !strategy) {
        // Default to claudekit for conflicts
        copyFile(claudekitPath, mergedPath);
        copiedFromClaudekit++;
        if (strategy === 'merge') merged++;
      }
    } else if (existsInAgent) {
      copyFile(agentPath, mergedPath);
      copiedFromAgent++;
    } else if (existsInClaudekit) {
      copyFile(claudekitPath, mergedPath);
      copiedFromClaudekit++;
    }
  }

  // Copy unique subdirectories from both sources
  const agentDirs = new Set(agentEntries.dirs.map(d => d.split(path.sep)[0]));
  const claudekitDirs = new Set(claudekitEntries.dirs.map(d => d.split(path.sep)[0]));

  // For directories that exist in both, we need to merge their contents
  for (const dir of agentDirs) {
    const agentSubDir = path.join(COMMANDS_DIR, dir);
    const claudekitSubDir = path.join(COMMANDS_CLAUDEKIT_DIR, dir);
    const mergedSubDir = path.join(MERGED_DIR, dir);

    if (claudekitDirs.has(dir)) {
      // Both have this directory - merge contents
      // Claudekit files already copied above, add agent-only files
      if (fs.existsSync(agentSubDir)) {
        const agentFiles = fs.readdirSync(agentSubDir, { withFileTypes: true });
        for (const entry of agentFiles) {
          const mergedEntryPath = path.join(mergedSubDir, entry.name);
          if (!fs.existsSync(mergedEntryPath)) {
            const agentEntryPath = path.join(agentSubDir, entry.name);
            if (entry.isDirectory()) {
              copyDir(agentEntryPath, mergedEntryPath);
            } else {
              copyFile(agentEntryPath, mergedEntryPath);
            }
          }
        }
      }
    }
  }

  // Count final files
  const finalEntries = getAllEntries(MERGED_DIR);

  console.log(`\n  From agent-assistant: ${copiedFromAgent} files`);
  console.log(`  From claudekit: ${copiedFromClaudekit} files`);
  console.log(`  Merged conflicts: ${merged} files`);
  console.log(`  Total merged: ${finalEntries.files.length} files`);
  console.log('\n' + '='.repeat(60));

  return finalEntries.files.length;
}

/**
 * List merged commands
 */
function listMergedCommands() {
  if (!fs.existsSync(MERGED_DIR)) {
    console.log('No merged commands. Run: npm run merge-commands');
    return;
  }

  const entries = getAllEntries(MERGED_DIR);
  console.log('\nMerged Commands:\n');

  // Get root-level commands
  const rootCommands = entries.files
    .filter(f => !f.includes(path.sep))
    .map(f => f.replace('.md', ''))
    .sort();

  for (const cmd of rootCommands) {
    console.log(`  /${cmd}`);

    // Check for sub-commands
    const subDir = cmd;
    const subCommands = entries.files
      .filter(f => f.startsWith(subDir + path.sep))
      .map(f => f.replace(subDir + path.sep, '').replace('.md', '').replace(/\\/g, ':'))
      .sort();

    for (const sub of subCommands) {
      console.log(`    /${cmd}:${sub}`);
    }
  }

  console.log(`\nTotal: ${entries.files.length} command files\n`);
}

// Run if called directly
if (require.main === module) {
  const arg = process.argv[2];

  if (arg === 'list') {
    listMergedCommands();
  } else {
    mergeCommands();
  }
}

module.exports = { mergeCommands, listMergedCommands };
