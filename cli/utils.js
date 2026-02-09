/**
 * Shared Utilities for Devkit CLI
 *
 * Common functions used across CLI modules.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const HOME = os.homedir();

/**
 * Supported AI tools configuration
 */
const TOOLS = {
  'claude': {
    id: 'claude',
    name: 'Claude Code',
    basePath: path.join(HOME, '.claude'),
    projectPath: '.claude',
    skillsPath: 'skills',
    rulesPath: 'rules',
    hooksPath: 'hooks',
    commandsPath: 'commands',
    supportsHooks: true,
    configFile: 'CLAUDE.md',
    detectCmd: 'claude --version',
    detectFolder: path.join(HOME, '.claude')
  },
  'cursor': {
    id: 'cursor',
    name: 'Cursor',
    basePath: path.join(HOME, '.cursor'),
    projectPath: '.cursor',
    skillsPath: 'skills',
    rulesPath: 'rules',
    hooksPath: 'hooks',
    commandsPath: 'commands',
    supportsHooks: false,
    configFile: 'CURSOR.md',
    detectCmd: null,
    detectFolder: path.join(HOME, '.cursor')
  },
  'copilot': {
    id: 'copilot',
    name: 'GitHub Copilot',
    basePath: path.join(HOME, '.copilot'),
    projectPath: '.github',
    skillsPath: 'skills',
    rulesPath: 'rules',
    hooksPath: null,
    commandsPath: null,
    supportsHooks: false,
    configFile: null,
    detectCmd: null,  // Don't use 'gh copilot --version' as it triggers interactive prompt
    detectFolder: path.join(HOME, '.copilot')
  },
  'gemini': {
    id: 'gemini',
    name: 'Gemini CLI',
    basePath: path.join(HOME, '.gemini'),
    projectPath: '.gemini',
    skillsPath: 'skills',
    rulesPath: 'rules',
    hooksPath: null,
    commandsPath: null,
    supportsHooks: false,
    configFile: 'GEMINI.md',
    detectCmd: 'gemini --version',
    detectFolder: path.join(HOME, '.gemini')
  }
};

/**
 * Detect which AI tools are installed on the system
 * @returns {Object} - Object with tool ids as keys and detection status
 */
function detectInstalledTools() {
  const results = {};

  for (const [toolId, tool] of Object.entries(TOOLS)) {
    let detected = false;
    let method = null;

    // Try command detection first
    if (tool.detectCmd) {
      try {
        execSync(tool.detectCmd, {
          stdio: 'pipe',
          timeout: 3000,  // 3 second timeout
          input: 'n\n'    // Auto-answer 'no' to any prompts
        });
        detected = true;
        method = 'cli';
      } catch (e) {
        // Command not found or timed out
      }
    }

    // Fallback to folder detection
    if (!detected && tool.detectFolder) {
      if (fs.existsSync(tool.detectFolder)) {
        detected = true;
        method = 'folder';
      }
    }

    results[toolId] = {
      ...tool,
      detected,
      method
    };
  }

  return results;
}

/**
 * Copy directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 * @param {Object} options - Options
 * @param {string[]} options.exclude - Patterns to exclude
 * @param {Set} options.visited - Visited directories (for cycle detection)
 * @param {number} options.depth - Current depth (max 50)
 * @returns {number} - Number of files copied
 */
function copyDir(src, dest, options = {}) {
  const { exclude = [], visited = new Set(), depth = 0 } = options;

  // Prevent infinite recursion
  if (depth > 50) return 0;

  if (!fs.existsSync(src)) return 0;

  // Detect symlink cycles
  try {
    const realSrc = fs.realpathSync(src);
    if (visited.has(realSrc)) return 0;
    visited.add(realSrc);
  } catch (e) {
    return 0;
  }

  fs.mkdirSync(dest, { recursive: true });
  let count = 0;

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    // Skip hidden files, tests, node_modules by default
    if (entry.name.startsWith('.') ||
        entry.name === '__tests__' ||
        entry.name === 'tests' ||
        entry.name === 'node_modules') {
      continue;
    }

    // Check custom exclusions
    if (exclude.some(pattern => entry.name.includes(pattern))) {
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath, { exclude, visited, depth: depth + 1 });
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }

  return count;
}

/**
 * Get directory size in KB
 * @param {string} dir - Directory path
 * @param {Set} visited - Visited directories (for cycle detection)
 * @param {number} depth - Current depth (max 50)
 * @returns {number} - Size in bytes
 */
function getDirSize(dir, visited = new Set(), depth = 0) {
  // Prevent infinite recursion
  if (depth > 50) return 0;

  if (!fs.existsSync(dir)) return 0;

  // Detect symlink cycles
  try {
    const realDir = fs.realpathSync(dir);
    if (visited.has(realDir)) return 0;
    visited.add(realDir);
  } catch (e) {
    return 0;
  }

  let size = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    try {
      if (entry.isDirectory()) {
        size += getDirSize(entryPath, visited, depth + 1);
      } else {
        size += fs.statSync(entryPath).size;
      }
    } catch (e) {
      // Skip unreadable files
    }
  }

  return size;
}

/**
 * Safely parse JSON file
 * @param {string} filePath - Path to JSON file
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} - Parsed JSON or default value
 */
function parseJsonFile(filePath, defaultValue = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`Warning: Failed to parse ${path.basename(filePath)}: ${e.message}`);
    return defaultValue;
  }
}

/**
 * Validate and resolve path
 * @param {string} inputPath - User-provided path
 * @param {boolean} mustExist - Whether path must exist
 * @returns {string|null} - Resolved absolute path or null if invalid
 */
function validatePath(inputPath, mustExist = false) {
  if (!inputPath) return null;

  try {
    const resolved = path.resolve(inputPath);

    if (mustExist && !fs.existsSync(resolved)) {
      console.error(`Error: Path does not exist: ${resolved}`);
      return null;
    }

    // Check if it's a directory when it exists
    if (fs.existsSync(resolved) && !fs.statSync(resolved).isDirectory()) {
      console.error(`Error: Path is not a directory: ${resolved}`);
      return null;
    }

    return resolved;
  } catch (e) {
    console.error(`Error: Invalid path: ${inputPath}`);
    return null;
  }
}

/**
 * Get all files and directories from a path recursively
 * @param {string} dir - Directory to scan
 * @param {string} basePath - Base path for relative paths
 * @returns {{files: string[], dirs: string[]}} - Files and directories
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

module.exports = {
  copyDir,
  getDirSize,
  parseJsonFile,
  validatePath,
  getAllEntries,
  detectInstalledTools,
  TOOLS,
  HOME
};
