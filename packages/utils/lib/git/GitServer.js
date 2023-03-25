import { pathExistsSync } from "path-exists";
import path from "node:path";
import { homedir } from "node:os";
import fs from "node:fs";

const TEMP_HOME = ".fxjzz-cli";
const TEMP_TOKEN = ".git_token";
const TEMP_PLATFORM = ".git_platform";
const TEMP_OWN = ".git_own";
const TEMP_LOGIN = ".git_login";

function createPlatformPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_PLATFORM);
}

function getGitPlatform() {
  if (pathExistsSync(createPlatformPath())) {
    return fs.readFileSync(createPlatformPath()).toString();
  }
  return null;
}

export { getGitPlatform };
