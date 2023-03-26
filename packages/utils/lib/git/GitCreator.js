import {
  createLoginPath,
  createOwnPath,
  createPlatformPath,
  createTokenPath,
} from "./GitServer.js";
import inquirer from "inquirer";
import fs from "node:fs";
import { execa } from "execa";
import fse from "fs-extra";
import { pathExistsSync } from "path-exists";

class GitCreator {
  constructor() {}

  async init() {
    // 判断token是否录入
    const tokenPath = createTokenPath();
    if (pathExistsSync(tokenPath)) {
      this.token = fse.readFileSync(tokenPath).toString();
    } else {
      let OBJ;
      OBJ = await this.getToken();
      this.token = OBJ.token;
      fs.writeFileSync(tokenPath, this.token);
    }
  }

  async getToken() {
    return await inquirer.prompt({
      name: "token",
      type: "password",
      message: "请输入token信息",
      validate: (val) => {
        if (val.length > 0) return true;
        else {
          return "请输入token";
        }
      },
    });
  }

  savePlatform(platform) {
    this.platform = platform;
    fs.writeFileSync(createPlatformPath(), platform);
  }

  saveOwn(own) {
    this.own = own;
    fs.writeFileSync(createOwnPath(), own);
  }

  saveLogin(login) {
    this.login = login;
    fs.writeFileSync(createLoginPath(), login);
  }

  getPlatform() {
    return this.platform;
  }

  getOwn() {
    return this.own;
  }

  getLogin() {
    return this.login;
  }

  cloneRepo(fullName, tag) {
    if (tag) {
      return execa("git", ["clone", this.getRepoUrl(fullName), "-b", tag]);
    } else {
      return execa("git", ["clone", this.getRepoUrl(fullName)]);
    }
  }

  installDependencies(cwd, fullName) {
    const projectPath = getProjectPath(cwd, fullName);
    if (pathExistsSync(projectPath)) {
      return execa(
        "npm",
        ["install", "--registry=https://registry.npmmirror.com"],
        { cwd: projectPath }
      );
    }
    return null;
  }

  async runRepo(cwd, fullName) {
    const projectPath = getProjectPath(cwd, fullName);
    const pkg = getPackageJson(cwd, fullName);
    if (pkg) {
      const { scripts, bin, name } = pkg;
      if (bin) {
        await execa(
          "npm",
          ["install", "-g", name, "--registry=https://registry.npmmirror.com"],
          { cwd: projectPath, stdout: "inherit" }
        );
      }
      if (scripts && scripts.dev) {
        return execa("npm", ["run", "dev"], {
          cwd: projectPath,
          stdout: "inherit",
        });
      } else if (scripts && scripts.start) {
        return execa("npm", ["start"], { cwd: projectPath, stdout: "inherit" });
      } else {
        log.warn("未找到启动命令");
      }
    }
  }

  getUser() {
    throw new Error("getUser must be implemented!");
  }

  getOrg() {
    throw new Error("getOrg must be implemented!");
  }

  createRepo() {
    throw new Error("createRepo must be implemented!");
  }
}

export default GitCreator;
