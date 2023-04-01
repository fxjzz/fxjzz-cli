import fse from "fs-extra";
import semver from "semver";
import path from "node:path";
import Command from "@fxjzz-cli/command";
import {
  log,
  initGitCreator,
  initGitType,
  createRemoteRepo,
  clearCache,
  makeInput,
  makeList,
} from "@fxjzz-cli/utils";
import simpleGit from "simple-git";
import figlet from "figlet";
import chalk from "chalk";

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
    console.log(
      chalk.yellow(
        figlet.textSync("F-CLI", {
          horizontalLayout: "full",
          font: "3D-ASCII",
          verticalLayout: "default",
          width: 120,
          whitespaceBreak: true,
        })
      )
    );
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
  //1
  async initRemoteRepo() {
    //实例化git对象
    this.gitAPI = await initGitCreator();

    //选择git仓库类型
    await initGitType(this.gitAPI);

    //创建远程仓库
    const dir = process.cwd();
    const pkg = fse.readJsonSync(path.resolve(dir, "package.json"));
    this.name = pkg.name;
    this.version = pkg.version || "1.0.0";
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
      log.info("创建.gitignore文件");
      fse.writeFileSync(gitIgnorePath, ignoreContent);
      log.success("创建成功!");
    }
  }
  //2
  async initLocal() {
    const repoURL = this.gitAPI.getRepoURL(`${this.gitAPI.login}/${this.name}`);

    //初始化git对象 引入simple-git库
    this.git = simpleGit(process.cwd());
    if (!fse.existsSync(path.resolve(process.cwd(), ".git"))) {
      log.info("正在初始化git...");
      await this.git.init();
      log.success("初始化成功");
    }

    const remotes = await this.git.getRemotes();
    //没有origin分支则执行
    if (!remotes.find((remote) => remote.name === "origin")) {
      this.git.addRemote("origin", repoURL);
      log.info("添加git remote");

      //检查本地 未提交信息并提交
      await this.checkNotCommitted();

      //检查远程master分支
      const tags = await this.git.listRemote(["--refs"]);
      if (tags.indexOf("refs/heads/master") >= 0) {
        await this.pullRemoteRepo("master", {
          "--allow-unrelated-histories": null,
        });
      } else {
        // 推送代码到远程master分支
        await this.pushRemoteRepo("master");
      }
    }
  }
  //3
  async commit() {
    await this.getCorrectVersion();
    await this.checkStash();
    //await this.checkNotCommitted();
    //切换到开发分支
    await this.checkoutBranch(this.branch);

    //合并远程 master和当前开发分支
    await this.pullRemoteMasterAndBranch();

    await this.pushRemoteRepo(this.branch);
  }
  //4
  async publish() {
    await this.checkTag();
    await this.checkoutBranch("master");
    await this.mergeBranchToMaster();
    await this.pushRemoteRepo("master");
    //await this.deleteLocalBranch();
    //await this.deleteRemoteBranch(); //删除远程开发分支
  }

  async checkTag() {
    log.info("获取远程 tag 列表");
    const tag = `release/${this.version}`;
    const tagList = await this.getRemoteBranchList("release");
    if (tagList.includes(this.version)) {
      log.info("远程 tag 已存在", tag);
      await this.git.push(["origin", `:refs/tags/${tag}`]);
      log.info("远程 tag 已删除", tag);
    }
    const localTagList = await this.git.tags();
    if (localTagList.all.includes(tag)) {
      log.info("本地 tag 已存在", tag);
      await this.git.tag(["-d", tag]);
      log.info("本地 tag 已删除", tag);
    }
    await this.git.addTag(tag);
    log.success("本地 tag 创建成功", tag);
    await this.git.pushTags("origin");
    log.success("远程 tag 推送成功", tag);
  }

  // async deleteLocalBranch() {
  //   log.info("开始删除本地分支", this.branch);
  //   await this.git.deleteLocalBranch(this.branch);
  //   log.success("删除本地分支成功", this.branch);
  // }

  // async deleteRemoteBranch() {
  //   log.info("开始删除远程分支", this.branch);
  //   await this.git.push(["origin", "--delete", this.branch]);
  //   log.success("删除远程分支成功", this.branch);
  // }

  async mergeBranchToMaster() {
    log.info("开始合并代码", `[${this.branch}] -> [master]`);
    await this.git.mergeFromTo(this.branch, "master");
    log.success("代码合并成功", `[${this.branch}] -> [master]`);
  }

  async checkoutBranch(branchName) {
    const localBranchList = await this.git.branchLocal();
    if (localBranchList.all.includes(branchName)) {
      //切换分支
      this.git.checkout(branchName);
    } else {
      //创建并切换
      await this.git.checkoutLocalBranch(branchName);
    }
    log.success(`success 切换本地分支${branchName}`);
  }

  async pullRemoteMasterAndBranch() {
    log.info(`正在拉取远程master分支 => ${this.branch}`);
    await this.pullRemoteRepo("master");
    log.success("拉取成功");
    const remoteBranchList = await this.getRemoteBranchList();
    if (remoteBranchList.indexOf(this.version) >= 0) {
      //拉取远程开发分支
      await this.pullRemoteRepo(this.branch);
    } else {
      log.error(`远程不存在该分支${this.branch}`);
    }
  }

  async checkStash() {
    log.info("检查 stash 记录");
    const stashList = await this.git.stashList();
    if (stashList.all.length > 0) {
      try {
        await this.git.stash(["pop"]);
        log.success("pop stash 成功");
      } catch (err) {
        throw new Error("代码存在冲突,请解决");
      }
    }
  }

  async getCorrectVersion() {
    log.info("获取代码分支");
    //暂定release 分支 ,后面根据需求再加。。
    const remoteBranchList = await this.getRemoteBranchList("release");

    let releaseVersion = null;
    if (remoteBranchList && remoteBranchList.length > 0) {
      releaseVersion = remoteBranchList[0];
    }

    const devVersion = this.version; //本地版本

    if (!releaseVersion) {
      //线上无版本
      this.branch = `dev/${devVersion}`;
    } else if (semver.gt(devVersion, releaseVersion)) {
      //开发(dev)版本大于线上版本时
      log.info("当前版本号大于线上版本号");
      this.branch = `dev/${devVersion}`;
    } else {
      log.info(
        "当前线上版本号大于本地版本号",
        `${releaseVersion} > ${devVersion}`
      );
      const incType = await makeList({
        message: "自动升级版本，请选择升级版本类型",
        defaultValue: "patch",
        choices: [
          {
            name: `小版本 (${releaseVersion} -> ${semver.inc(
              releaseVersion,
              "patch"
            )})`,
            value: "patch",
          },
          {
            name: `中版本 (${releaseVersion} -> ${semver.inc(
              releaseVersion,
              "minor"
            )})`,
            value: "minor",
          },
          {
            name: `大版本 (${releaseVersion} -> ${semver.inc(
              releaseVersion,
              "major"
            )})`,
            value: "major",
          },
        ],
      });
      const incVersion = semver.inc(releaseVersion, incType);
      this.branch = `dev/${incVersion}`;
      this.version = incVersion;
      this.syncVersionToPackageJson();
    }
    console.log(`分支获取成功${this.branch}`);
  }

  syncVersionToPackageJson() {
    const dir = process.cwd();
    const pkgPath = path.resolve(dir, "package.json");
    const pkg = fse.readJsonSync(pkgPath);
    if (pkg && pkg.version !== this.version) {
      pkg.version = this.version;
      fse.writeJsonSync(pkgPath, pkg, { spaces: 2 });
    }
  }

  async getRemoteBranchList(type) {
    const remoteList = await this.git.listRemote(["--refs"]);
    let reg = new RegExp();
    if (type === "release") {
      // release/0.0.1
      reg = /.+?refs\/tags\/release\/(\d+\.\d+\.\d+)/g;
    } else {
      // dev/0.0.1
      reg = /.+?refs\/tags\/dev\/(\d+\.\d+\.\d+)/g;
    }

    const arr = remoteList
      .split("\n")
      .map((remote) => {
        const match = reg.exec(remote);
        reg.lastIndex = 0;
        if (match && semver.valid(match[1])) {
          return match[1];
        }
      })
      .filter((_) => _)
      .sort((a, b) => {
        if (semver.lte(b, a)) {
          if (a === b) return 0;
          return -1;
        }
        return 1;
      });
    return arr;
  }

  async checkNotCommitted() {
    const status = await this.git.status();
    if (
      status.not_added.length > 0 ||
      status.created.length > 0 ||
      status.deleted.length > 0 ||
      status.modified.length > 0 ||
      status.renamed.length > 0
    ) {
      await this.git.add(status.not_added);
      await this.git.add(status.created);
      await this.git.add(status.deleted);
      await this.git.add(status.modified);
      await this.git.add(status.renamed.map((item) => item.to));
      let message;
      while (!message) {
        message = await makeInput({
          message: "请输入 commit 信息:",
        });
      }
      await this.git.commit(message);
      log.success("本地commit 提交成功");
    }
  }

  async pullRemoteRepo(branch = "master", options = {}) {
    log.info("本地正同步远程代码pull...");
    await this.git.pull("origin", branch, options).catch((err) => {
      console.log(err);
    });
  }

  async pushRemoteRepo(branchName) {
    log.success("push");
    await this.git.push("origin", branchName);
  }
}

function Commit(instance) {
  return new CommitCommand(instance);
}

export default Commit;

