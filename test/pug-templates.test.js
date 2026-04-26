const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const pug = require("pug");

function getPugFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getPugFiles(fullPath));
    } else if (entry.isFile() && fullPath.endsWith(".pug")) {
      files.push(fullPath);
    }
  }
  return files;
}

test("all pug templates compile", () => {
  const pugFiles = getPugFiles(path.join(__dirname, "..", "views"));
  assert.ok(pugFiles.length > 0);
  for (const filePath of pugFiles) {
    assert.doesNotThrow(() => pug.compileFile(filePath), `Failed to compile ${filePath}`);
  }
});
