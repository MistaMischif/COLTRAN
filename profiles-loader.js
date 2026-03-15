const fs = require('fs-extra');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config', 'profiles.json');
const profilesJson = fs.readJsonSync(configPath);

function getProfile(key) {
  const p = profilesJson[key];
  if (!p) throw new Error('Unknown profile: ' + key);
  const baseDir = path.join(__dirname, '..');
  return {
    ...p,
    contentRoot: path.join(baseDir, p.contentRoot),
    publicDir: path.join(baseDir, p.publicDir),
    draftDir: path.join(baseDir, p.draftDir),
    siteDir: path.join(baseDir, p.siteDir)
  };
}

module.exports = { getProfile };
