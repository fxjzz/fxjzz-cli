import log from './log.js'
import isDebug from './isDebug.js'
import { makeInput, makeList, makeConfirm } from './inquirer.js'
import { hasPnpm3OrLater, hasPnpmVersionLater, hasYarn } from './env.js'
import resolvePkg from './pkg.js'

function printErrorLog(e, type) {
  if (isDebug()) {
    log.error(type, e);
  } else {
    log.error(type, e.message);
  }
}

export { resolvePkg, hasPnpm3OrLater, hasPnpmVersionLater, hasYarn, log, isDebug, makeList, makeConfirm, makeInput, printErrorLog }