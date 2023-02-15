import path from 'node:path'
import { pathExistsSync } from 'path-exists'
import fse from 'fs-extra'
import ora from 'ora'
import { execa } from 'execa'
import { printErrorLog, log } from '@fxjzz-cli/utils'


function getCacheDir(targetPath) {
  //path : /C/user/.fxjzz-cli/addTemplate
  return path.resolve(targetPath, 'node_modules')
}

function makeCacheDir(targetPath) {
  const cacheDir = getCacheDir(targetPath)
  if (!pathExistsSync(cacheDir)) {  //缓存目录不存在
    fse.mkdirpSync(cacheDir)      // 创建目录
  }
}

async function downloadPlugins(plugins) {
  if (plugins.ESlint === 'common') {

  }
}

async function downloadAddTemplate(targetPath, selectedTemplate, plugins) {
  const { npmName } = selectedTemplate
  downloadPlugins(plugins)
  const installCommand = 'npm'
  const installArgs = ['install', `${npmName}`]
  const cwd = targetPath
  log.verbose('installArgs', installArgs)
  log.verbose('cwd', cwd)
  await execa(installCommand, installArgs, { cwd })
}

export default async function downloadTemplate(selectedTemplate) {
  const { targetPath, template, plugins } = selectedTemplate
  makeCacheDir(targetPath)
  const spinner = ora('正在下载...').start()
  try {
    await downloadAddTemplate(targetPath, template, plugins)
    spinner.stop()
    log.success('下载完成')
  } catch (err) {
    spinner.stop()
    printErrorLog(err)
  }
}