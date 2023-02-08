import { log, isDebug } from '@fxjzz-cli/utils'

function printErrorLog(e, type) {
  if (isDebug()) {
    log.error(type, e);
  } else {
    log.error(type, e.message);
  }
}
//监听报错信息
process.on('unhandledRejection', (e) => printErrorLog(e, 'promise'))

process.on('uncaughtException', (e) => printErrorLog(e, 'error'))