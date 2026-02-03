#!/usr/bin/env node
/**
 * Manual Sync from Upstream
 *
 * Usage: npm run sync:upstream
 *
 * This script:
 * 1. Creates a new branch (sync/skills-YYYY-MM-DD)
 * 2. Clones upstream repos to temp folder
 * 3. Shows what's new/changed
 * 4. You review and customize with AI
 * 5. Then commit and push when ready
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const UPSTREAMS = {
  skills: [
    {
      name: 'antigravity-awesome-skills',
      repo: 'https://github.com/sickn33/antigravity-awesome-skills.git',
      path: 'skills'
    },
    {
      name: 'agent-assistant',
      repo: 'https://github.com/hainamchung/agent-assistant.git',
      path: 'skills'
    }
  ],
  rules: [
    {
      name: 'skill-rule',
      repo: 'https://github.com/ngxtm/skill-rule.git',
      path: 'rules'
    }
  ]
};

const TEMP_DIR = path.join(process.env.TEMP || '/tmp', 'devkit-sync');
const ROOT_DIR = path.resolve(__dirname, '..');

function run(cmd, options = {}) {
  console.log(`  > ${cmd}`);
  try {
    return execSync(cmd, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      cwd: options.cwd || ROOT_DIR,
      ...options
    });
  } catch (e) {
    if (!options.ignoreError) throw e;
    return '';
  }
}

function getDate() {
  return new Date().toISOString().split('T')[0];
}

function ensureCleanWorkdir() {
  const status = run('git status --porcelain', { silent: true });
  if (status.trim()) {
    console.error('\n❌ Working directory is not clean. Commit or stash changes first.\n');
    process.exit(1);
  }
}

function createSyncBranch() {
  const branchName = `sync/upstream-${getDate()}`;
  console.log(`\n📌 Creating branch: ${branchName}`);

  // Check if branch exists
  const exists = run(`git branch --list ${branchName}`, { silent: true }).trim();
  if (exists) {
    console.log(`   Branch already exists, switching to it...`);
    run(`git checkout ${branchName}`);
  } else {
    run(`git checkout -b ${branchName}`);
  }

  return branchName;
}

function cloneUpstreams() {
  console.log('\n📥 Cloning upstream repositories...\n');

  // Clean temp dir
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  const cloned = {};

  for (const [category, sources] of Object.entries(UPSTREAMS)) {
    cloned[category] = [];
    for (const source of sources) {
      const targetDir = path.join(TEMP_DIR, source.name);
      console.log(`   Cloning ${source.name}...`);
      run(`git clone --depth 1 ${source.repo} "${targetDir}"`, { silent: true });
      cloned[category].push({
        ...source,
        localPath: path.join(targetDir, source.path)
      });
    }
  }

  return cloned;
}

function listNewItems(upstreamDir, localDir, itemType) {
  if (!fs.existsSync(upstreamDir)) return { new: [], updated: [] };
  if (!fs.existsSync(localDir)) return { new: [], updated: [] };

  const upstreamItems = fs.readdirSync(upstreamDir).filter(f =>
    fs.statSync(path.join(upstreamDir, f)).isDirectory() && !f.startsWith('.')
  );
  const localItems = fs.readdirSync(localDir).filter(f =>
    fs.statSync(path.join(localDir, f)).isDirectory() && !f.startsWith('.')
  );

  const localSet = new Set(localItems);
  const newItems = upstreamItems.filter(item => !localSet.has(item));
  const existingItems = upstreamItems.filter(item => localSet.has(item));

  return { new: newItems, existing: existingItems, total: upstreamItems.length };
}

function showReport(cloned) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 UPSTREAM SYNC REPORT');
  console.log('='.repeat(60));

  for (const [category, sources] of Object.entries(cloned)) {
    const localDir = path.join(ROOT_DIR, category);
    console.log(`\n📁 ${category.toUpperCase()}:`);

    for (const source of sources) {
      const result = listNewItems(source.localPath, localDir, category);
      console.log(`\n   ${source.name}:`);
      console.log(`   Total in upstream: ${result.total}`);
      console.log(`   New (not in local): ${result.new.length}`);

      if (result.new.length > 0 && result.new.length <= 20) {
        result.new.forEach(item => console.log(`     + ${item}`));
      } else if (result.new.length > 20) {
        result.new.slice(0, 10).forEach(item => console.log(`     + ${item}`));
        console.log(`     ... and ${result.new.length - 10} more`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📂 Upstream repos cloned to: ' + TEMP_DIR);
  console.log('\n✅ NEXT STEPS:');
  console.log('   1. Browse the temp folder to see new skills/rules');
  console.log('   2. Copy what you want: cp -r <source> ./skills/<name>');
  console.log('   3. Or ask AI to help review and integrate');
  console.log('   4. When done: git add . && git commit -m "feat(skills): sync from upstream"');
  console.log('   5. Push and create PR: git push -u origin <branch>');
  console.log('');
}

async function main() {
  console.log('🔄 DEVKIT MANUAL SYNC');
  console.log('='.repeat(60));

  // Check clean workdir
  ensureCleanWorkdir();

  // Create sync branch
  const branch = createSyncBranch();

  // Clone upstreams
  const cloned = cloneUpstreams();

  // Show report
  showReport(cloned);

  console.log(`🌿 You are now on branch: ${branch}\n`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
