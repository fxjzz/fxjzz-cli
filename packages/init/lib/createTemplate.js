import path from 'node:path'
import { homedir } from 'node:os'
import { log, makeInput, makeList, makeConfirm } from '@fxjzz-cli/utils'

const ADD_TEMPLATE = [
  {
    name: 'Vue',
    value: 'template-vue',
    npmName: '@fxjzz-cli/template-vue'
  },
  {
    name: 'Vue + TS',
    value: 'template-vue-ts',
    npmName: '@fxjzz-cli/template-vue-ts'
  },
  {
    name: 'React',
    value: 'template-react',
    npmName: '@fxjzz-cli/template-react'
  },
  {
    name: 'React + TS',
    value: 'template-react-ts',
    npmName: '@fxjzz-cli/template-react-ts'
  }
]
const ADD_CSS = [
  {
    name: 'none',
    value: 'css'
  },
  {
    name: 'Sass / Scss',
    value: 'scss'
  },
  {
    name: 'Less',
    value: 'less'
  },
  {
    name: 'Stylus',
    value: 'stylus'
  }
]
const ADD_Linter = [
  {
    name: 'none',
    value: 'none'
  },
  {
    name: 'ESLint with error prevention only',
    value: 'common'
  },
  {
    name: 'ESLint + Airbnb config',
    value: 'airbnb'
  },
  {
    name: 'ESLint + Standard config',
    value: 'standard'
  },
  {
    name: 'ESLint + XO config',
    value: 'xo'
  }
]
const TEMP_HOME = '.fxjzz-cli'


function getAddName(name) {
  return makeInput({
    message: 'Please input your project name:',
    defaultValue: name || 'f-project'
  })
}

function getAddTemplate() {
  return makeList({
    choices: ADD_TEMPLATE,
    message: 'Plesase pick a framkWork:'
  })
}


function getAddCSSPreprocessor() {
  return makeList({
    message: 'pick a CSS pre-processor:',
    choices: ADD_CSS
  })
}

function getAddLinter() {
  return makeList({
    message: 'Pick a linter / formatter config:',
    choices: ADD_Linter
  })
}

function getAddGitHooks() {
  return makeConfirm({
    message: 'do you want to use git hooks in your project?',
    defaultValue: false
  })
}

function getTargetPath() {
  return path.resolve(`${homedir()}/${TEMP_HOME}`, 'addTemplate');
}

export default async function createTemplate(name, opts) {
  let addName = name
  if (!name) {
    addName = await getAddName(name)
  }
  const addTemplate = await getAddTemplate()
  const addCSS = await getAddCSSPreprocessor()
  const addLinter = await getAddLinter()
  const addGitHooks = await getAddGitHooks()
  const selectedTemplate = ADD_TEMPLATE.find(i => i.value === addTemplate)

  return {
    name: addName,
    template: selectedTemplate,
    plugins: {
      cssLang: addCSS,
      ESlint: addLinter,
      gitHooks: addGitHooks,
    },
    targetPath: getTargetPath() //缓存文件路径
  }
}
