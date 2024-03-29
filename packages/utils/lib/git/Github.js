import axios from "axios";
import GitCreator from "./GitCreator.js";
import log from "../log.js";

const BASE_URL = "https://api.github.com";

class Github extends GitCreator {
  constructor() {
    super();
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
    });
    this.service.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${this.token}`;
        config.headers["Accept"] = "application/vnd.github+json";
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
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
      params,
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
  //git@github.com:fxjzz/zzz.git
  getRepoURL(name) {
    return `git@github.com:${name}.git`;
  }

  getRepo(owner, repo) {
    return this.get(
      `/repos/${owner}/${repo}`,
      {},
      {
        accept: "application/vnd.github+json",
      }
    ).catch((err) => {
      return null;
    });
  }

  async createRepo(name) {
    const repo = await this.getRepo(this.login, name);
    if (!repo) {
      log.info("仓库不存在，开始创建");
      if (this.own === "user") {
        return this.post(
          "/user/repos",
          { name },
          {
            accept: "application/vnd.github+json",
          }
        );
      } else if (this.own === "org") {
        const url = "orgs/" + this.login + "/repos";
        return this.post(
          url,
          { name },
          {
            accept: "application/vnd.github+json",
          }
        );
      }
    } else {
      log.info("仓库存在，直接返回");
      return repo;
    }
  }
}

export default Github;
