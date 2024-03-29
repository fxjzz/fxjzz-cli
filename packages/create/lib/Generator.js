import GeneratorAPI from "./GeneratorAPI.js";
import writeFileTree from "./writeFileTree.js";

export default class Generator {
  constructor(targetDir, { pkg, plugins, answers }) {
    this.targetDir = targetDir;

    this.originalPkg = pkg;
    this.pkg = { ...pkg };

    this.plugins = plugins;
    this.answers = answers;

    this.fileMiddleWares = [];
    this.files = {};

    this.imports = {};
  }

  async generate() {
    await this.initPlugins();
    await this.resolveFiles();
    this.files["package.json"] = `${JSON.stringify(this.pkg, null, 2)}\n`;
    writeFileTree(this.targetDir, this.files);
  }

  async initPlugins() {
    this.plugins.forEach((plugin) => {
      const { id, apply, options, answers } = plugin;

      const api = new GeneratorAPI(id, this, options, this.answers);

      if (typeof apply === "function") apply(api, options, answers);
      else apply.default(api, options, answers); //
    });
  }

  async resolveFiles() {
    //空对象
    const { files } = this;
    //callback 目录注入模板
    for (const middleWare of this.fileMiddleWares) {
      //执行回调函数 ，把内容写入对象
      await middleWare(files);
    }
  }
}

