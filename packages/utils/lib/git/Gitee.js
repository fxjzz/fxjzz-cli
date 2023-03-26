import axios from "axios";
import GitCreator from "./GitCreator.js";

const BASE_URL = "https://gitee.com/api/v5";

class Gitee extends GitCreator {
  constructor() {
    super();
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
    });
    this.service.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  get(url, params, headers) {
    return this.service({
      url,
      params: {
        ...params,
        access_token: this.token,
      },
      method: "get",
      headers,
    });
  }

  post(url, data, headers) {
    return this.service({
      url,
      data,
      params: {
        access_token: this.token,
      },
      method: "post",
      headers,
    });
  }

  getUser() {
    return this.get("/user").catch(() => {
      throw new Error("请输入合适 或 正确的token");
    });
  }

  getOrg() {
    return this.get("/user/orgs");
  }

  getRepoURL(name) {
    return `git@gitee.com:${name}.git`;
  }

  getRepo(owner, repo) {
    return this.get(`/repos/${owner}/${repo}`).catch((err) => {
      return null;
    });
  }

  async createRepo(name) {
    // 检查远程仓库是否存在，如果存在，则跳过创建
    const repo = await this.getRepo(this.login, name);
    if (!repo) {
      console.log(`正在创建远程仓库${name}......`);
      console.log(this.own);
      if (this.own === "user") {
        return this.post("/user/repos", { name });
      } else if (this.own === "org") {
        const url = "orgs/" + this.login + "/repos";
        return this.post(url, { name });
      }
    } else {
      return repo;
    }
  }
}

export default Gitee;
