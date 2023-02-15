import fse from 'fs-extra'
import path from 'node:path'

export default function (dir, files) {
  Object.keys(files).forEach(name => {
    const filePath = path.join(dir, name)
    fse.ensureDirSync(dir)
    fse.writeFileSync(filePath, files[name])
  })
}