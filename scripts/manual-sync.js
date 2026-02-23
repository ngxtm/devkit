#!/usr/bin/env node
/**
 * Manual Sync from Upstream
 *
 * Usage:
 *   node scripts/manual-sync.js                       # Original behavior (branch + text report)
 *   node scripts/manual-sync.js --no-branch           # Clone + text report, no branch
 *   node scripts/manual-sync.js --no-branch --json    # Clone + JSON report (for AI)
 *   node scripts/manual-sync.js --copy <skill-name>   # Copy skill from temp to local
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- CLI Args ---
const args = process.argv.slice(2);
const FLAG_NO_BRANCH = args.includes('--no-branch');
const FLAG_JSON = args.includes('--json');
const COPY_INDEX = args.indexOf('--copy');
const FLAG_COPY = COPY_INDEX !== -1 ? args[COPY_INDEX + 1] : null;

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
  ],
  'external-skills': [
    {
      name: 'react-doctor',
      repo: 'https://github.com/millionco/react-doctor.git',
      checkFiles: ['install-skill.sh', 'README.md', 'package.json'],
      localSkill: 'skills/react-doctor/SKILL.md'
    }
  ]
};

const TEMP_DIR = path.join(process.env.TEMP || '/tmp', 'devkit-sync');
const ROOT_DIR = path.resolve(__dirname, '..');

function run(cmd, options = {}) {
  if (!FLAG_JSON) console.log(`  > ${cmd}`);
  try {
    return execSync(cmd, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : (FLAG_JSON ? 'pipe' : 'inherit'),
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
  if (!FLAG_JSON) console.log(`\n📌 Creating branch: ${branchName}`);

  const exists = run(`git branch --list ${branchName}`, { silent: true }).trim();
  if (exists) {
    if (!FLAG_JSON) console.log(`   Branch already exists, switching to it...`);
    run(`git checkout ${branchName}`);
  } else {
    run(`git checkout -b ${branchName}`);
  }

  return branchName;
}

function fileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

function cloneUpstreams() {
  if (!FLAG_JSON) console.log('\n📥 Cloning upstream repositories...\n');

  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  const cloned = {};

  for (const [category, sources] of Object.entries(UPSTREAMS)) {
    cloned[category] = [];
    for (const source of sources) {
      const targetDir = path.join(TEMP_DIR, source.name);
      if (!FLAG_JSON) console.log(`   Cloning ${source.name}...`);
      run(`git clone --depth 1 ${source.repo} "${targetDir}"`, { silent: true });
      cloned[category].push({
        ...source,
        localPath: source.path ? path.join(targetDir, source.path) : targetDir
      });
    }
  }

  return cloned;
}

function listNewAndUpdatedItems(upstreamDir, localDir, sourceName) {
  if (!fs.existsSync(upstreamDir)) return { new: [], updated: [], unchanged: 0, total: 0 };
  if (!fs.existsSync(localDir)) return { new: [], updated: [], unchanged: 0, total: 0 };

  const upstreamItems = fs.readdirSync(upstreamDir).filter(f =>
    fs.statSync(path.join(upstreamDir, f)).isDirectory() && !f.startsWith('.')
  );
  const localItems = fs.readdirSync(localDir).filter(f =>
    fs.statSync(path.join(localDir, f)).isDirectory() && !f.startsWith('.')
  );

  const localSet = new Set(localItems);
  const newItems = [];
  const updatedItems = [];
  let unchangedCount = 0;

  for (const item of upstreamItems) {
    if (!localSet.has(item)) {
      // New skill
      newItems.push({
        name: item,
        source: sourceName,
        path: path.join(upstreamDir, item)
      });
    } else {
      // Existing — compare hash of SKILL.md (for skills) or main file
      const upstreamFile = path.join(upstreamDir, item, 'SKILL.md');
      const localFile = path.join(localDir, item, 'SKILL.md');
      const uHash = fileHash(upstreamFile);
      const lHash = fileHash(localFile);

      if (uHash && lHash && uHash !== lHash) {
        updatedItems.push({
          name: item,
          source: sourceName,
          localHash: lHash,
          upstreamHash: uHash
        });
      } else {
        unchangedCount++;
      }
    }
  }

  return { new: newItems, updated: updatedItems, unchanged: unchangedCount, total: upstreamItems.length };
}

function getExternalSkillInfo(source, clonedPath) {
  const info = {
    name: source.name,
    localExists: false,
    upstreamVersion: null,
    localVersion: null,
    checkFiles: [],
    tempPath: clonedPath
  };

  // Check local skill
  const localSkillPath = source.localSkill ? path.join(ROOT_DIR, source.localSkill) : null;
  info.localExists = localSkillPath && fs.existsSync(localSkillPath);

  // Read upstream version from package.json
  const pkgPath = path.join(clonedPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      info.upstreamVersion = pkg.version || null;
    } catch (e) { /* ignore parse errors */ }
  }

  // Read local version from SKILL.md frontmatter
  if (info.localExists && localSkillPath) {
    const content = fs.readFileSync(localSkillPath, 'utf8');
    const versionMatch = content.match(/upstream-version:\s*(.+)/);
    if (versionMatch) {
      info.localVersion = versionMatch[1].trim();
    }
  }

  // Check files existence in cloned repo
  if (source.checkFiles) {
    info.checkFiles = source.checkFiles.map(f => ({
      file: f,
      exists: fs.existsSync(path.join(clonedPath, f))
    }));
  }

  return info;
}

function copySkill(skillName) {
  // Find which source has this skill
  let found = false;
  for (const source of UPSTREAMS.skills) {
    const src = path.join(TEMP_DIR, source.name, source.path || '', skillName);
    if (fs.existsSync(src)) {
      const dest = path.join(ROOT_DIR, 'skills', skillName);
      fs.cpSync(src, dest, { recursive: true });
      console.log(`✅ Copied ${skillName} from ${source.name} to skills/${skillName}`);
      found = true;
      break;
    }
  }

  // Also check rules
  if (!found) {
    for (const source of UPSTREAMS.rules) {
      const src = path.join(TEMP_DIR, source.name, source.path || '', skillName);
      if (fs.existsSync(src)) {
        const dest = path.join(ROOT_DIR, 'rules', skillName);
        fs.cpSync(src, dest, { recursive: true });
        console.log(`✅ Copied ${skillName} from ${source.name} to rules/${skillName}`);
        found = true;
        break;
      }
    }
  }

  if (!found) {
    console.error(`❌ Could not find "${skillName}" in any upstream temp directory.`);
    console.error(`   Make sure you ran sync first (without --copy).`);
    process.exit(1);
  }
}

function buildJsonReport(cloned) {
  const report = {
    tempDir: TEMP_DIR,
    skills: { new: [], updated: [], unchanged: 0 },
    rules: { new: [], updated: [], unchanged: 0 },
    'external-skills': []
  };

  // Skills
  for (const source of cloned.skills) {
    const localDir = path.join(ROOT_DIR, 'skills');
    const result = listNewAndUpdatedItems(source.localPath, localDir, source.name);
    report.skills.new.push(...result.new);
    report.skills.updated.push(...result.updated);
    report.skills.unchanged += result.unchanged;
  }

  // Rules
  for (const source of cloned.rules) {
    const localDir = path.join(ROOT_DIR, 'rules');
    const result = listNewAndUpdatedItems(source.localPath, localDir, source.name);
    report.rules.new.push(...result.new);
    report.rules.updated.push(...result.updated);
    report.rules.unchanged += result.unchanged;
  }

  // External skills
  for (const source of cloned['external-skills']) {
    const clonedPath = path.join(TEMP_DIR, source.name);
    report['external-skills'].push(getExternalSkillInfo(source, clonedPath));
  }

  return report;
}

function showTextReport(cloned) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 UPSTREAM SYNC REPORT');
  console.log('='.repeat(60));

  for (const [category, sources] of Object.entries(cloned)) {
    console.log(`\n📁 ${category.toUpperCase()}:`);

    if (category === 'external-skills') {
      for (const source of sources) {
        const info = getExternalSkillInfo(source, path.join(TEMP_DIR, source.name));
        console.log(`\n   ${source.name}:`);
        console.log(`   Status: ${info.localExists ? 'Local skill exists' : 'No local skill yet'}`);
        if (info.upstreamVersion) console.log(`   Upstream version: ${info.upstreamVersion}`);
        if (info.localVersion) console.log(`   Local version: ${info.localVersion}`);
        console.log(`   Upstream files to review:`);
        info.checkFiles.forEach(f => {
          console.log(`     ${f.exists ? '✓' : '✗'} ${f.file}`);
        });
        console.log(`   📖 See UPSTREAM.md in skill dir for sync guide`);
      }
      continue;
    }

    const localDir = path.join(ROOT_DIR, category);

    for (const source of sources) {
      const result = listNewAndUpdatedItems(source.localPath, localDir, source.name);
      console.log(`\n   ${source.name}:`);
      console.log(`   Total in upstream: ${result.total}`);
      console.log(`   New (not in local): ${result.new.length}`);
      console.log(`   Updated (content changed): ${result.updated.length}`);

      if (result.new.length > 0 && result.new.length <= 20) {
        result.new.forEach(item => console.log(`     + ${item.name}`));
      } else if (result.new.length > 20) {
        result.new.slice(0, 10).forEach(item => console.log(`     + ${item.name}`));
        console.log(`     ... and ${result.new.length - 10} more`);
      }

      if (result.updated.length > 0 && result.updated.length <= 20) {
        result.updated.forEach(item => console.log(`     ~ ${item.name}`));
      } else if (result.updated.length > 20) {
        result.updated.slice(0, 10).forEach(item => console.log(`     ~ ${item.name}`));
        console.log(`     ... and ${result.updated.length - 10} more`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📂 Upstream repos cloned to: ' + TEMP_DIR);
  console.log('\n✅ NEXT STEPS:');
  console.log('   1. Browse the temp folder to see new skills/rules');
  console.log('   2. Copy what you want: node scripts/manual-sync.js --copy <name>');
  console.log('   3. Or ask AI to help review and integrate');
  console.log('   4. When done: git add . && git commit -m "feat(skills): sync from upstream"');
  console.log('   5. Push and create PR: git push -u origin <branch>');
  console.log('');
}

async function main() {
  // Handle --copy flag
  if (FLAG_COPY) {
    copySkill(FLAG_COPY);
    return;
  }

  if (!FLAG_JSON) {
    console.log('🔄 DEVKIT MANUAL SYNC');
    console.log('='.repeat(60));
  }

  // Conditional: skip workdir check and branch creation with --no-branch
  let branch = null;
  if (!FLAG_NO_BRANCH) {
    ensureCleanWorkdir();
    branch = createSyncBranch();
  }

  // Clone upstreams
  const cloned = cloneUpstreams();

  // Output
  if (FLAG_JSON) {
    const report = buildJsonReport(cloned);
    process.stdout.write(JSON.stringify(report, null, 2));
  } else {
    showTextReport(cloned);
    if (branch) {
      console.log(`🌿 You are now on branch: ${branch}\n`);
    }
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
