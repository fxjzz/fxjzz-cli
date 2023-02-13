import path from 'node:path'
import fse from 'fs-extra'
import glob from 'glob'
import ejs from 'ejs'
import ora from 'ora'
import { pathExistsSync } from 'path-exists'
import { log } from '@fxjzz-cli/utils'

//获取缓存文件路径
function getCacheFilePath(targetPath, template) {
  return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

function copyFile(targetPath, template, installDir) {
  const originFile = getCacheFilePath(targetPath, template)
  const fileList = fse.readdirSync(originFile)
  const spinner = ora('正在拷贝模板文件...').start()
  fileList.forEach(f => {
    fse.copySync(`${originFile}/${f}`, `${installDir}/${f}`)
  })
  spinner.stop()
  log.success('拷贝成功')
}

function ejsRender(dir, userInputName) {
  glob('**', {
    cwd: dir,
    nodir: true,
    ignore: ['**/public/**']
  }, (err, files) => {
    files.forEach(f => {
      const filePath = path.join(dir, f)
      ejs.renderFile(filePath, {
        data: {
          name: userInputName
        }
      }, (err, file) => {
        if (!err) {
          fse.writeFileSync(filePath, file)
        } else {
          log.error('error')
        }
      })
    })
  })
}

export default function installTemplate(selectedTemplate, opts) {
  const { targetPath, template, name } = selectedTemplate
  const currentPath = process.cwd()
  const { force } = opts
  fse.ensureDirSync(targetPath) //判断缓存目录存在
  //下载到当前目录
  const installDir = path.resolve(`${currentPath}/${name}`)
  if (pathExistsSync(installDir)) {  //该路径存在
    if (!force) {
      log.error(`当前目录已存在${name}文件夹`)
      throw new Error('已存在同名文件')
    } else {
      fse.removeSync(installDir)
      fse.ensureDirSync(installDir)
    }
  } else {
    fse.ensureDirSync(installDir)
  }
  copyFile(targetPath, template, installDir)
  ejsRender(installDir, name)
}