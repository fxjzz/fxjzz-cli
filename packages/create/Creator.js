import inquirer from "inquirer"
import chalk from 'chalk'
import PromptModuleAPI from "./lib/promptModuleAPI.js"
import promptModules from "./lib/promptModules/index.js"
import { resolvePkg, hasPnpm3OrLater, hasYarn } from "@fxjzz-cli/utils"


class Creator {
  constructor(name, targetDir) {
    this.name = name
    this.targetDir = targetDir
    //初始化框架
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts()
    this.presetPrompt = presetPrompt
    this.featurePrompt = featurePrompt

    this.injectedPrompts = [] //暂时没用

    this.promptCompleteCbs = [] //回调函数

    this.answers = { preset: 'Vue' }

    //this 这个creator实例
    const promptAPI = new PromptModuleAPI(this)

    //一个函数数组。
    //[cssPreprocessors, linter, typescript, gitHooks, router]
    //遍历注入
    promptModules.forEach((f) => f(promptAPI))

  }
  async create(opts = {}) {
    const preset = await this.promptAndResolvePreset();

    preset.plugins['@fxjzz-cli/cli-service'] = {
      projectName: this.name,
      ...preset
    }
    console.log('preset', preset);

    const packageManager = hasPnpm3OrLater() ? 'pnpm' : hasYarn() ? 'yarn' : 'npm'

    console.log(`✨  Creating project in ${chalk.yellow(this.targetDir)}.`)

    const pkg = {
      name: this.name,
      version: '0.1.0',
      private: true,
      devDependencies: {},
      ...resolvePkg(this.targetDir),  //用不到感觉，解析targetDir的package.json
    }

  }


  //resolve解决 introduction prompts(引导性提示)
  resolveIntroPrompts() {
    //preset 预设
    const presetPrompt = {
      name: 'preset',
      type: 'list',
      message: 'Please pick a frameWork:',
      choices: [
        {
          name: 'React',
          value: 'React',
        },
        {
          name: 'Vue',
          value: 'Vue',
        }
      ]
    }
    const featurePrompt = {
      name: 'features',
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [],
      pageSize: 10
    }
    return { presetPrompt, featurePrompt }
  }

  async promptAndResolvePreset() {
    //定义交互框架
    const answers = await inquirer.prompt(this.getFinalPrompts());
    console.log('answers', answers);
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
    console.log('123', [this.presetPrompt, this.featurePrompt, ...this.injectedPrompts]);
    return [this.presetPrompt, this.featurePrompt, ...this.injectedPrompts]
  }
}

export default Creator