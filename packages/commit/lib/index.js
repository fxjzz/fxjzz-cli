import fse from "fs-extra";
import path from "node:path";
import Command from "@fxjzz-cli/command";
import {
  initGitCreator,
  initGitType,
  createRemoteRepo,
  clearCache,
} from "@fxjzz-cli/utils";

class CommitCommand extends Command {
  get command() {
    return "commit";
  }

  get description() {
    return "commit project";
  }

  get options() {
    return [
      ["-c, --clear", "清空缓存", false],
      ["-p, --publish", "发布", false],
    ];
  }

  async action([{ clear, publish }]) {
    if (clear) {
      clearCache();
    }
    await this.initRemoteRepo();
    await this.initLocal();
    await this.commit();
    if (publish) {
      await this.publish();
    }
  }

  async initRemoteRepo() {
    //实例化git对象
    this.gitAPI = await initGitCreator();

    //选择git仓库类型
    await initGitType(this.gitAPI);

    //创建远程仓库
    const dir = process.cwd();
    const pkg = fse.readJsonSync(path.resolve(dir, "package.json"));
    this.name = pkg.name;
    await createRemoteRepo(this.gitAPI, pkg.name);

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

  async initLocal() {
    const repoURL = this.gitAPI.getRepoURL(`${this.gitAPI.login}/${this.name}`);
    console.log(repoURL);
  }
}

function Commit(instance) {
  return new CommitCommand(instance);
}

export default Commit;

