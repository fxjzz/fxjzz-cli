import { program } from 'commander'
import { dirname } from 'dirname-filename-esm'
import fse from 'fs-extra'
import semver from 'semver'
import { log } from '@fxjzz-cli/utils'
import path from 'path'

const __dirname = dirname(import.meta)
const pkgPath = path.resolve(__dirname, '../package.json')
const pkg = JSON.parse(Buffer.from(fse.readFileSync(pkgPath)).toString())

const LOWEST_NODE_VERSION = '14.0.0'

const checkNodeVersion = function () {
  log.verbose('node version', process.version)
  if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(chalk.red(`请安装 ${LOWEST_NODE_VERSION} 版本以上的Node.js`))
  }
}
const preAction = function () {
  checkNodeVersion()
}

export default function createCLI() {
  log.info('version', pkg.version)
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .hook("preAction", preAction)
  program.on('option:debug', () => {
    log.verbose('debug', 'debug 模式 启动')
  })
  program.on('command:*', (err) => {
    log.error('未知命令:' + err)
  })
  return program
}