import { execSync } from 'child_process'
import semver from 'semver'

export const hasYarn = () => {
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function getPnpmVersion() {
  let pnpmVersion
  try {
    pnpmVersion = execSync('pnpm --version', { stdio: ['pipe', 'pipe', 'ignore'] }).toString()
  } catch (e) { }
  return pnpmVersion || '0.0.0'
}
export const hasPnpmVersionLater = (version) => {
  semver.gte(getPnpmVersion(), version)
}
export const hasPnpm3OrLater = () => hasPnpmVersionLater('3.0.0')


export const hasGit = () => {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};

export const hasProjectGit = (cwd) => {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore', cwd });
    return true;
  } catch (e) {
    return false;
  }
};