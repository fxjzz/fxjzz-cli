import { makeList } from "../inquirer.js";
import { getGitPlatform, getGitOwn, getGitLogin } from "./GitServer.js";
import Github from "./Github.js";
import Gitee from "./Gitee.js";

export async function initGitCreator(clear) {
  let platform = getGitPlatform();
  if (!platform) {
    platform = await makeList({
      message: "请选择git平台",
      type: "list",
      choices: [
        {
          name: "GitHub",
          value: "github",
        },
        {
          name: "Gitee",
          value: "gitee",
        },
      ],
    });
  }

  let gitAPI = null;
  if (platform === "github") {
    gitAPI = new Github();
  } else if (platform === "gitee") {
    gitAPI = new Gitee();
  }

  gitAPI.savePlatform(platform);
  await gitAPI.init();
  return gitAPI;
}

export async function initGitType(gitAPI) {
  let gitOwn = getGitOwn(); //获取仓库类型
  let gitLogin = getGitLogin(); //获取仓库登录名

  if (!gitLogin && !gitOwn) {
    const user = await gitAPI.getUser();
    const org = await gitAPI.getOrg();

    if (!gitOwn) {
      gitOwn = await makeList({
        message: "请选择仓库类型",
        choices: [
          {
            name: "User",
            value: "user",
          },
          {
            name: "Organization",
            value: "org",
          },
        ],
      });
    }
    if (gitOwn === "user") {
      gitLogin = user?.login;
    } else {
      const orgList = org.map((item) => ({
        name: item.name || item.login,
        value: item.login,
      }));
      gitLogin = await makeList({
        message: "请选择组织",
        choices: orgList,
      });
    }
  }

  if (!gitLogin || !gitOwn) {
    throw new Error(
      '未获取到用户的Git登录信息! 请使用"fx commit --clear"清除缓存后重试'
    );
  }

  //仓库类型
  gitAPI.saveOwn(gitOwn);
  //仓库名
  gitAPI.saveLogin(gitLogin);

  return gitLogin;
}

export async function createRemoteRepo(gitAPI, name) {
  await gitAPI.createRepo(name);
}
