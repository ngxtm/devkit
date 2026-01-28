/**
 * Shared Utilities for Devkit CLI
 *
 * Common functions used across CLI modules.
 */

const fs = require('fs');
const path = require('path');

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
  getAllEntries
};
