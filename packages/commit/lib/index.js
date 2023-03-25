import { homedir } from "node:os";
import fs from "node:fs";
import path from "node:path";
import { initGitServer } from "@fxjzz-cli/utils";
const commit = () => {
  const gitPlatform = createRemoteRepo();
  console.log(gitPlatform);
};
async function createRemoteRepo() {
  await initGitServer();
  // const home = homedir();
  // const CACHE_DIR = ".fxjzz-cli";
  // const FILE_GIT_PLATFORM = ".git_platform";
  // let filePath = path.resolve(home, CACHE_DIR, FILE_GIT_PLATFORM);
  // if (fs.existsSync(filePath)) {
  //   return fs.readFileSync(filePath).toString();
  // }
  // return null;
}
export default commit;

