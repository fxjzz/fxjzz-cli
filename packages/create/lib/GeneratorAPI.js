import { globby } from "globby";
import ejs from "ejs";
import fs from "node:fs";
import path from "node:path";

function renderFile(name, data) {
  const template = fs.readFileSync(name, "utf-8");
  return ejs.render(template, { data });
}

function extractCallDir(source, projectName, plugin) {
  const cwd = process.cwd();
  return path.join(
    cwd,
    `./${projectName}/node_modules/@fxjzz-cli/${plugin}/lib/${source}`
  );
}

export default class GeneratorAPI {
  constructor(id, generator, options, answers) {
    this.id = id;
    this.generator = generator;
    this.options = options;

    this.answers = answers;

    this.entryFile = this.getEntryFile();
  }

  render(source, options) {
    const { plugin, data } = options;
    const { projectName } = this.options;
    //模板目录
    const baseDir = extractCallDir(source, projectName, plugin);

    this.injectFileMiddleware(async (files) => {
      //模板目录下的所有文件的数组
      const allFiles = await globby(["**/*"], { cwd: baseDir, dot: true });

      for (const rawPath of allFiles) {
        const sourcePath = path.resolve(baseDir, rawPath);
        const content = await renderFile(sourcePath, data);
        files[rawPath] = content;
      }
    });
  }

  extendPackage(fields) {
    for (const key in fields) {
      this.generator.pkg[key] = {
        ...this.generator.pkg[key],
        ...fields[key],
      };
    }
  }

  getEntryFile() {}
  injectFileMiddleware(middleware) {
    this.generator.fileMiddleWares.push(middleware);
  }

  injectImports(path, content) {
    this.generator.imports[path] = content;
  }
}

