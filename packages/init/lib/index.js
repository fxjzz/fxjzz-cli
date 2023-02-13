import Command from '@fxjzz-cli/command'
import { log } from '@fxjzz-cli/utils'
import createTemplate from './createTemplate.js'
import downloadTemplate from './downloadTemplate.js'
import installTemplate from './installTemplate.js'

class InitCommand extends Command {
  //创建私有属性
  get command() {
    return 'init [name]'
  }
  get description() {
    return 'init a project'
  }
  get options() {
    return [
      ['-f, --force', '是否强制更新', false]
    ]
  }
  async action([name, opts]) {
    const selectedTemplate = await createTemplate(name, opts)
    log.verbose('template', selectedTemplate)
    await downloadTemplate(selectedTemplate)
    await installTemplate(selectedTemplate, opts)
  }
  preAction() {
    //console.log('action 之前');
  }
  postAction() {
    //console.log('action 之后');
  }
}

function Init(instance) {
  return new InitCommand(instance)
}
export default Init;
