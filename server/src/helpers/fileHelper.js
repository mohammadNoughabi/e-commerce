const fs = require("fs").promises;

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

module.exports = { fileExists };
