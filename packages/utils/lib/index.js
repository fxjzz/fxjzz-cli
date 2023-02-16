import log from './log.js'
import isDebug from './isDebug.js'
import { makeInput, makeList, makeConfirm } from './inquirer.js'
import { hasPnpm3OrLater, hasPnpmVersionLater, hasYarn, hasGit, hasProjectGit } from './env.js'
import resolvePkg from './pkg.js'
import commandSpawn from './commandSpawn.js'
import wrapLoading from './wrapLoading.js'

function printErrorLog(e, type) {
  if (isDebug()) {
    log.error(type, e);
  } else {
    log.error(type, e.message);
  }
}

export { wrapLoading, hasProjectGit, hasGit, commandSpawn, resolvePkg, hasPnpm3OrLater, hasPnpmVersionLater, hasYarn, log, isDebug, makeList, makeConfirm, makeInput, printErrorLog }