const fs = require('fs');
const path = require('path');

function findFiles(dir, filename, results = []) {
  if (!fs.existsSync(dir)) return results;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== '.bin') {
        findFiles(full, filename, results);
      } else if (entry.isFile() && entry.name === filename) {
        results.push(full);
      }
    }
  } catch (e) {}
  return results;
}

// Stub all copies of the broken _formatLimit.js
const formatLimitFiles = findFiles('node_modules', '_formatLimit.js');
formatLimitFiles.forEach(p => {
  try {
    fs.writeFileSync(p, 'module.exports = function() {};');
    console.log('Patched:', p);
  } catch (e) {
    console.error('Could not patch:', p, e.message);
  }
});

// Also stub ajv-keywords index.js inside fork-ts-checker to prevent keyword errors
const ajvKwIndexFiles = findFiles('node_modules/fork-ts-checker-webpack-plugin', 'index.js');
ajvKwIndexFiles.forEach(p => {
  if (p.includes('ajv-keywords')) {
    try {
      const stub = 'module.exports = function(ajv) { return ajv; };\nmodule.exports.get = function() { return {}; };\n';
      fs.writeFileSync(p, stub);
      console.log('Patched ajv-keywords index:', p);
    } catch (e) {
      console.error('Could not patch:', p, e.message);
    }
  }
});

console.log('Patch complete.');
