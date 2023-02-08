import log from 'npmlog'
import isDebug from './isDebug.js'
//  debug环境使用。
if (isDebug()) {
  log.level = 'verbose'
} else {
  log.level = 'info'
}

//日志开头。
log.heading = 'fxjzz'

//自定义level
log.addLevel('success', 2000, { fg: 'green', bold: true })
export default log;