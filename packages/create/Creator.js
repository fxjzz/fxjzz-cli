import inquirer from "inquirer";
import chalk from "chalk";
import { execa } from "execa";
import {
  loadModule,
  wrapLoading,
  commandSpawn,
  hasGit,
  hasProjectGit,
  resolvePkg,
  hasPnpm3OrLater,
  hasYarn,
  hasPnpmVersionLater,
} from "@fxjzz-cli/utils";
import PromptModuleAPI from "./lib/promptModuleAPI.js";
import promptModules from "./lib/promptModules/index.js";
import writeFileTree from "./lib/writeFileTree.js";
import sortObject from "./lib/sortObject.js";
import Generator from "./lib/Generator.js";

class Creator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    //初始化框架
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts();
    this.presetPrompt = presetPrompt;
    this.featurePrompt = featurePrompt;

    this.injectedPrompts = []; //暂时没用

    this.promptCompleteCbs = []; //回调函数

    this.answers = { preset: "Vue" };

    //this 这个creator实例
    const promptAPI = new PromptModuleAPI(this);

    //一个函数数组。
    //[cssPreprocessors, linter, typescript, gitHooks, router]
    //遍历注入
    promptModules.forEach((f) => f(promptAPI));
  }
  async create(opts = {}) {
    const preset = await this.promptAndResolvePreset();

    preset.plugins["@fxjzz-cli/cli-service"] = {
      projectName: this.name,
      ...preset,
    };

    const packageManager = hasPnpm3OrLater()
      ? "pnpm"
      : hasYarn()
      ? "yarn"
      : "npm";

    console.log(`✨  Creating project in ${chalk.yellow(this.targetDir)}.`);

    const pkg = {
      name: this.name,
      version: "0.1.0",
      private: true,
      devDependencies: {},
      ...resolvePkg(this.targetDir), //解析targetDir的package.json
    };

    //给pkg添加依赖
    const deps = Object.keys(preset.plugins);
    deps.forEach((dep) => {
      pkg.devDependencies[dep] = "^1.0.0";
    });

    writeFileTree(this.targetDir, {
      "package.json": JSON.stringify(pkg, null, 2),
    });

    // generate a .npmrc file for pnpm, to persist the `shamefully-flatten` flag
    if (packageManager === "pnpm") {
      const pnpmConfig = hasPnpmVersionLater("4.0.0")
        ? // pnpm v7 makes breaking change to set strict-peer-dependencies=true by default, which may cause some problems when installing
          "shamefully-hoist=true\nstrict-peer-dependencies=false\n"
        : "shamefully-flatten=true\n";

      writeFileTree(this.targetDir, {
        ".npmrc": pnpmConfig,
      });
    }

    const shouldInitGit = this.shouldInitGit(opts);
    if (shouldInitGit) {
      console.log(`🗃  Initializing git repository...`);
      await execa("git init", { cwd: this.targetDir });
    }

    //install plugins
    await wrapLoading(
      () => commandSpawn(packageManager, ["install"], { cwd: this.targetDir }),
      `⚙\u{fe0f}  `
    );

    console.log(`🚀  Invoking generators...`);
    //解析插件
    const plugins = await this.resolvePlugins(preset.plugins);
    const generator = new Generator(this.targetDir, {
      pkg,
      plugins,
      answers: this.answers,
    });
    await generator.generate();

    // await wrapLoading(
    //   () => commandSpawn(packageManager, ['install'], { cwd: this.targetDir }),
    //   `📦  `
    // );
  }

  async resolvePlugins(rawPlugins) {
    //对象 排序
    rawPlugins = sortObject(rawPlugins, ["@fxjzz-cli/cli-service"]);

    const plugins = [];

    for (const id of Object.keys(rawPlugins)) {
      const apply = (await loadModule(`${id}`, this.targetDir)) || (() => {});
      const options = { ...rawPlugins[id], projectName: this.name };
      plugins.push({ id, apply, options, answers: this.answers });
    }
    return plugins;
  }

  //resolve解决 introduction prompts(引导性提示)
  resolveIntroPrompts() {
    //preset 预设
    const presetPrompt = {
      name: "preset",
      type: "list",
      message: "Please pick a frameWork:",
      choices: [
        {
          name: "React",
          value: "React",
        },
        {
          name: "Vue",
          value: "Vue",
        },
      ],
    };
    const featurePrompt = {
      name: "features",
      type: "checkbox",
      message: "Check the features needed for your project:",
      choices: [],
      pageSize: 10,
    };
    return { presetPrompt, featurePrompt };
  }

  async promptAndResolvePreset() {
    //定义交互框架
    const answers = await inquirer.prompt(this.getFinalPrompts());
    this.answers = answers;
    const preset = {
      useConfigFiles: true,
      plugins: {},
    };
    answers.features = answers.features || [];

    // (answers, opts) => {
    //   if (answers.features?.includes('TypeScript')) {
    //     opts.plugins['@fxjzz-cli/cli-plugin-typescript'] = {}
    //   }
    // }
    this.promptCompleteCbs.forEach((cb) => cb(answers, preset));

    return preset;
  }

  getFinalPrompts() {
    return [this.presetPrompt, this.featurePrompt, ...this.injectedPrompts];
  }

  shouldInitGit(opts) {
    if (!hasGit) {
      return false;
    }
    if (opts.git) {
      return true;
    }
    return !hasProjectGit(this.targetDir);
  }
}

export default Creator;

