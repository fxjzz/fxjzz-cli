import fs from 'node:fs'
import path from 'node:path'
import { readPackage } from 'read-pkg';

function resolvePkg(context) {
  if (fs.existsSync(path.join(context, 'package.json'))) {
    return readPackage({ cwd: context })
  }

  return {}

}

export default resolvePkg