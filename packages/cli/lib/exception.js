import { printErrorLog } from '@fxjzz-cli/utils'


//监听报错信息
process.on('unhandledRejection', (e) => printErrorLog(e, 'promise'))

process.on('uncaughtException', (e) => printErrorLog(e, 'error'))