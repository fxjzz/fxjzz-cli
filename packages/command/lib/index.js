class Command {
  constructor(instance) {
    //必须传参，否则报错
    if (!instance) {
      throw new Error('command instance must not be null!')
    }
    this.program = instance
    const cmd = this.program.command(this.command)
    cmd.hook('preAction', () => {
      this.preAction()
    })
    cmd.hook('postAction', () => {
      this.postAction()
    })
    cmd.description(this.description)
    if (this.options?.length > 0) {
      this.options.forEach(args => {
        cmd.option(...args)
      })
    }
    cmd.action((...params) => {
      this.action(params)
    })
  }
  //子类必须要有command属性
  get command() {
    throw new Error('command must be implements')
  }
  get description() {
    throw new Error('description muse be implements')
  }
  get options() {
    return []
  }
  get action() {
    throw new Error('action must be implements')
  }
  get preAction() {
    //empty
  }
  get postAction() {
    //empty
  }
}
export default Command