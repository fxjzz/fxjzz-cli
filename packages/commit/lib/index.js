import fse from "fs-extra";
import path from "node:path";
import {
  initGitCreator,
  initGitType,
  createRemoteRepo,
} from "@fxjzz-cli/utils";

async function initRemoteRepo() {
  //实例化git对象
  const gitAPI = await initGitCreator();

  //选择git仓库类型
  await initGitType(gitAPI);

  //创建远程仓库
  const dir = process.cwd();
  const pkg = fse.readJsonSync(path.resolve(dir, "package.json"));

  await createRemoteRepo(gitAPI, pkg.name);
}

const commit = () => {
  const gitPlatform = initRemoteRepo();
};

export default commit;

