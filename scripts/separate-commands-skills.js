#!/usr/bin/env node

/**
 * Separate Commands and Skills
 *
 * Creates two outputs:
 * 1. core-commands/ - Essential commands only (~50-100 files, ~1MB)
 * 2. skills/ - All skills for on-demand loading (~6MB)
 *
 * This prevents context overflow while keeping all skills accessible.
 */

const fs = require('fs');
const path = require('path');

const PACKAGE_ROOT = path.join(__dirname, '..');
const COMMANDS_DIR = path.join(PACKAGE_ROOT, 'commands');
const COMMANDS_CLAUDEKIT_DIR = path.join(PACKAGE_ROOT, 'commands-claudekit');
const SKILLS_DIR = path.join(PACKAGE_ROOT, 'skills');
const OUTPUT_COMMANDS = path.join(PACKAGE_ROOT, 'core-commands');
const OUTPUT_SKILLS = path.join(PACKAGE_ROOT, 'dist-skills');

// Core commands to always include (from commands/ and commands-claudekit/)
const CORE_COMMANDS = [
  // Essential workflow commands
  'ask.md',
  'auto.md',
  'bootstrap.md',
  'brainstorm.md',
  'code.md',
  'cook.md',
  'debug.md',
  'deploy.md',
  'design.md',
  'docs.md',
  'fix.md',
  'plan.md',
  'review.md',
  'test.md',

  // Git workflow
  'commit.md',
  'create-pr.md',
  'iterate-pr.md',

  // Utilities
  'ck-help.md',
  'coding-level.md',
  'journal.md',
  'kanban.md',
  'preview.md',
  'scout.md',
  'watzup.md',
  'worktree.md',

  // Content
  'content.md',
  'readme.md',
  'pdf.md',
  'docx.md',
  'pptx.md',
  'xlsx.md'
];

// Skills to promote to core commands (frequently used)
const PROMOTED_SKILLS = [
  'learn',
  'react-expert',
  'nextjs-best-practices',
  'typescript-pro',
  'python-pro',
  'golang-pro',
  'docker-expert',
  'git-advanced-workflows',
  'test-master',
  'systematic-debugging',
  'api-design-principles',
  'database-design',
  'auth-implementation-patterns',
  'mcp-developer',
  'prompt-engineering'
];

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
    if (entry.name.startsWith('.')) continue;

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
 * Get directory size
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
 * Build core commands
 */
function buildCoreCommands() {
  console.log('\n' + '='.repeat(60));
  console.log('  BUILD CORE COMMANDS');
  console.log('='.repeat(60));

  // Clean output
  if (fs.existsSync(OUTPUT_COMMANDS)) {
    fs.rmSync(OUTPUT_COMMANDS, { recursive: true, force: true });
  }
  fs.mkdirSync(OUTPUT_COMMANDS, { recursive: true });

  let copiedCount = 0;

  // Copy core commands from commands/
  console.log('\n  From commands/:');
  for (const cmd of CORE_COMMANDS) {
    const src = path.join(COMMANDS_DIR, cmd);
    if (fs.existsSync(src)) {
      copyFile(src, path.join(OUTPUT_COMMANDS, cmd));
      console.log(`    + ${cmd}`);
      copiedCount++;
    }

    // Also copy subcommands folder if exists
    const cmdName = cmd.replace('.md', '');
    const subDir = path.join(COMMANDS_DIR, cmdName);
    if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
      const subCount = copyDir(subDir, path.join(OUTPUT_COMMANDS, cmdName));
      console.log(`    + ${cmdName}/ (${subCount} files)`);
      copiedCount += subCount;
    }
  }

  // Copy from commands-claudekit/ (prefer these for conflicts)
  console.log('\n  From commands-claudekit/:');
  for (const cmd of CORE_COMMANDS) {
    const src = path.join(COMMANDS_CLAUDEKIT_DIR, cmd);
    if (fs.existsSync(src)) {
      copyFile(src, path.join(OUTPUT_COMMANDS, cmd));
      console.log(`    + ${cmd} (override)`);
    }

    // Subcommands
    const cmdName = cmd.replace('.md', '');
    const subDir = path.join(COMMANDS_CLAUDEKIT_DIR, cmdName);
    if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
      const subCount = copyDir(subDir, path.join(OUTPUT_COMMANDS, cmdName));
      if (subCount > 0) {
        console.log(`    + ${cmdName}/ (${subCount} files, override)`);
      }
    }
  }

  // Copy promoted skills as commands
  console.log('\n  Promoted skills:');
  for (const skillName of PROMOTED_SKILLS) {
    const skillFile = path.join(SKILLS_DIR, skillName, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      copyFile(skillFile, path.join(OUTPUT_COMMANDS, `${skillName}.md`));
      console.log(`    + ${skillName}.md`);
      copiedCount++;
    }
  }

  const totalSize = getDirSize(OUTPUT_COMMANDS);
  console.log(`\n  Total: ${copiedCount} files (${(totalSize / 1024).toFixed(0)} KB)`);

  return copiedCount;
}

/**
 * Build skills folder (for on-demand loading)
 */
function buildSkillsFolder() {
  console.log('\n' + '='.repeat(60));
  console.log('  BUILD SKILLS FOLDER');
  console.log('='.repeat(60));

  // Clean output
  if (fs.existsSync(OUTPUT_SKILLS)) {
    fs.rmSync(OUTPUT_SKILLS, { recursive: true, force: true });
  }

  // Copy all skills
  const count = copyDir(SKILLS_DIR, OUTPUT_SKILLS);
  const totalSize = getDirSize(OUTPUT_SKILLS);

  console.log(`\n  Copied: ${count} files`);
  console.log(`  Size: ${(totalSize / (1024 * 1024)).toFixed(1)} MB`);

  return count;
}

// Main
console.log('\nSeparating commands and skills for optimized installation...');

const cmdCount = buildCoreCommands();
const skillCount = buildSkillsFolder();

console.log('\n' + '='.repeat(60));
console.log('  SUMMARY');
console.log('='.repeat(60));
console.log(`\n  Core commands: ${cmdCount} files (${(getDirSize(OUTPUT_COMMANDS) / 1024).toFixed(0)} KB)`);
console.log(`  Skills: ${skillCount} files (${(getDirSize(OUTPUT_SKILLS) / (1024 * 1024)).toFixed(1)} MB)`);
console.log('\n  Output:');
console.log(`    ${OUTPUT_COMMANDS}`);
console.log(`    ${OUTPUT_SKILLS}`);
console.log('');
