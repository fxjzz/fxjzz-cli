import fse from "fs-extra";
import path from "node:path";
import {
  initGitCreator,
  initGitType,
  createRemoteRepo,
} from "@fxjzz-cli/utils";

async function initRemoteRepo(clear) {
  //实例化git对象
  const gitAPI = await initGitCreator(clear);

  //选择git仓库类型
  await initGitType(gitAPI);

  //创建远程仓库
  const dir = process.cwd();
  const pkg = fse.readJsonSync(path.resolve(dir, "package.json"));

  await createRemoteRepo(gitAPI, pkg.name);

  //生成.gitignore文件
  const gitIgnorePath = path.resolve(dir, ".gitignore");
  const ignoreContent = `.DS_Store
  node_modules
  /dist
  
  
  # local env files
  .env.local
  .env.*.local
  
  # Log files
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
  pnpm-debug.log*
  
  # Editor directories and files
  .idea
  .vscode
  *.suo
  *.ntvs*
  *.njsproj
  *.sln
  *.sw?`;
  if (!fse.existsSync(gitIgnorePath)) {
    console.log("创建gitignore文件");
    fse.writeFileSync(gitIgnorePath, ignoreContent);
    console.log("chenggogn ");
  }
}

const commit = (clear) => {
  const gitPlatform = initRemoteRepo(clear);
};

export default commit;

