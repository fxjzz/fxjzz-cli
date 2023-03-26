import { pathExistsSync } from "path-exists";
import path from "node:path";
import { homedir } from "node:os";
import fs from "node:fs";
import fse from "fs-extra";

const TEMP_HOME = ".fxjzz-cli";
const TEMP_TOKEN = ".git_token";
const TEMP_PLATFORM = ".git_platform";
const TEMP_OWN = ".git_own";
const TEMP_LOGIN = ".git_login";

function clearCache() {
  const platform = createPlatformPath();
  const token = createTokenPath();
  const own = createOwnPath();
  const login = createLoginPath();
  fse.removeSync(platform);
  fse.removeSync(token);
  fse.removeSync(own);
  fse.removeSync(login);
}

function createPlatformPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_PLATFORM);
}

function createTokenPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_TOKEN);
}

function createOwnPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_OWN);
}

function createLoginPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_LOGIN);
}

function getGitPlatform() {
  if (pathExistsSync(createPlatformPath())) {
    return fs.readFileSync(createPlatformPath()).toString();
  }
  return null;
}

function getGitOwn() {
  if (pathExistsSync(createOwnPath())) {
    return fs.readFileSync(createOwnPath()).toString();
  }
  return null;
}

function getGitLogin() {
  if (pathExistsSync(createLoginPath())) {
    return fs.readFileSync(createLoginPath()).toString();
  }
  return null;
}

export {
  createPlatformPath,
  createTokenPath,
  createOwnPath,
  createLoginPath,
  getGitPlatform,
  getGitOwn,
  getGitLogin,
  clearCache,
};
