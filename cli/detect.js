/**
 * Project Type Detection
 *
 * Detects the technology stack of a project by analyzing:
 * - Configuration files (package.json, pubspec.yaml, go.mod, etc.)
 * - Dependencies
 * - File patterns
 */

const fs = require('fs');
const path = require('path');

/**
 * Detection rules for different technology stacks
 * Each rule can have:
 * - files: Array of files that indicate this tech (any match)
 * - dependencies: Array of npm dependencies (any match)
 * - devDependencies: Array of npm devDependencies (any match)
 * - rules: Array of rule directories to install
 */
const DETECTION_RULES = {
  // Flutter/Dart
  flutter: {
    files: ['pubspec.yaml', 'pubspec.lock'],
    rules: ['flutter', 'dart']
  },

  // React (standalone)
  react: {
    dependencies: ['react', 'react-dom'],
    excludeIf: ['next'], // Don't detect if Next.js is present
    rules: ['react', 'typescript']
  },

  // Next.js (includes React rules)
  nextjs: {
    files: ['next.config.js', 'next.config.mjs', 'next.config.ts'],
    dependencies: ['next'],
    rules: ['nextjs', 'react', 'typescript']
  },

  // NestJS
  nestjs: {
    files: ['nest-cli.json'],
    dependencies: ['@nestjs/core', '@nestjs/common'],
    rules: ['nestjs', 'typescript']
  },

  // Golang
  golang: {
    files: ['go.mod', 'go.sum'],
    rules: ['golang']
  },

  // Python
  python: {
    files: ['pyproject.toml', 'requirements.txt', 'Pipfile', 'setup.py', 'poetry.lock'],
    rules: ['python']
  },

  // Rust
  rust: {
    files: ['Cargo.toml', 'Cargo.lock'],
    rules: ['rust']
  },

  // Java/Kotlin
  java: {
    files: ['pom.xml', 'build.gradle', 'build.gradle.kts'],
    rules: ['java']
  },

  // TypeScript (generic, if not covered by framework)
  typescript: {
    files: ['tsconfig.json'],
    devDependencies: ['typescript'],
    rules: ['typescript']
  },

  // Prisma ORM
  prisma: {
    files: ['prisma/schema.prisma'],
    dependencies: ['@prisma/client'],
    devDependencies: ['prisma'],
    rules: ['prisma']
  },

  // Supabase
  supabase: {
    files: ['supabase/config.toml'],
    dependencies: ['@supabase/supabase-js'],
    rules: ['supabase']
  },

  // Vue.js
  vue: {
    dependencies: ['vue'],
    files: ['vue.config.js', 'vite.config.ts', 'vite.config.js'],
    rules: ['vue', 'typescript']
  },

  // Angular
  angular: {
    files: ['angular.json'],
    dependencies: ['@angular/core'],
    rules: ['angular', 'typescript']
  },

  // Svelte/SvelteKit
  svelte: {
    files: ['svelte.config.js'],
    dependencies: ['svelte', '@sveltejs/kit'],
    rules: ['svelte', 'typescript']
  },

  // Express.js
  express: {
    dependencies: ['express'],
    rules: ['express', 'nodejs']
  },

  // Fastify
  fastify: {
    dependencies: ['fastify'],
    rules: ['fastify', 'nodejs']
  },

  // Hono
  hono: {
    dependencies: ['hono'],
    rules: ['hono', 'typescript']
  },

  // Tailwind CSS
  tailwind: {
    files: ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.cjs'],
    devDependencies: ['tailwindcss'],
    rules: ['tailwind']
  },

  // Docker
  docker: {
    files: ['Dockerfile', 'docker-compose.yml', 'docker-compose.yaml'],
    rules: ['docker']
  }
};

/**
 * Parse package.json and extract dependencies
 */
function parsePackageJson(projectDir) {
  const pkgPath = path.join(projectDir, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    return { dependencies: {}, devDependencies: {} };
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return {
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {}
    };
  } catch (e) {
    return { dependencies: {}, devDependencies: {} };
  }
}

/**
 * Check if any file from the list exists in the project
 */
function hasAnyFile(projectDir, files) {
  return files.some(file => fs.existsSync(path.join(projectDir, file)));
}

/**
 * Check if any dependency from the list exists
 */
function hasAnyDependency(deps, targetDeps) {
  return targetDeps.some(dep => dep in deps);
}

/**
 * Detect project types based on rules
 * @param {string} projectDir - Project directory to analyze
 * @returns {string[]} - Array of detected technology types
 */
function detectProjectType(projectDir = process.cwd()) {
  const detected = new Set();
  const { dependencies, devDependencies } = parsePackageJson(projectDir);
  const allDeps = { ...dependencies, ...devDependencies };

  // First pass: detect all matching rules
  const matches = [];

  for (const [type, config] of Object.entries(DETECTION_RULES)) {
    let isMatch = false;

    // Check files
    if (config.files && hasAnyFile(projectDir, config.files)) {
      isMatch = true;
    }

    // Check dependencies
    if (config.dependencies && hasAnyDependency(allDeps, config.dependencies)) {
      isMatch = true;
    }

    // Check devDependencies specifically
    if (config.devDependencies && hasAnyDependency(devDependencies, config.devDependencies)) {
      isMatch = true;
    }

    if (isMatch) {
      // Check exclusions
      if (config.excludeIf) {
        const shouldExclude = config.excludeIf.some(excludeType => {
          const excludeConfig = DETECTION_RULES[excludeType];
          if (!excludeConfig) return false;

          if (excludeConfig.files && hasAnyFile(projectDir, excludeConfig.files)) return true;
          if (excludeConfig.dependencies && hasAnyDependency(allDeps, excludeConfig.dependencies)) return true;
          return false;
        });

        if (shouldExclude) continue;
      }

      matches.push({ type, rules: config.rules });
    }
  }

  // Collect unique rules from all matches
  for (const match of matches) {
    detected.add(match.type);
  }

  return Array.from(detected);
}

/**
 * Get all rules that should be installed for detected types
 * @param {string[]} detectedTypes - Array of detected technology types
 * @returns {string[]} - Array of unique rule directories to install
 */
function getRulesForTypes(detectedTypes) {
  const rules = new Set();

  for (const type of detectedTypes) {
    const config = DETECTION_RULES[type];
    if (config && config.rules) {
      config.rules.forEach(rule => rules.add(rule));
    }
  }

  return Array.from(rules);
}

/**
 * Print detection results
 */
function printDetectionResults(projectDir = process.cwd()) {
  const detected = detectProjectType(projectDir);
  const rules = getRulesForTypes(detected);

  console.log('\n' + '='.repeat(50));
  console.log('  PROJECT DETECTION RESULTS');
  console.log('='.repeat(50));
  console.log(`\nDirectory: ${projectDir}`);

  if (detected.length === 0) {
    console.log('\nNo specific technology detected.');
    console.log('Will install base commands only.\n');
    return;
  }

  console.log('\nDetected Technologies:');
  detected.forEach(tech => console.log(`  - ${tech}`));

  console.log('\nRules to Install:');
  rules.forEach(rule => console.log(`  - ${rule}`));

  console.log('');
}

module.exports = {
  DETECTION_RULES,
  detectProjectType,
  getRulesForTypes,
  printDetectionResults,
  parsePackageJson
};
