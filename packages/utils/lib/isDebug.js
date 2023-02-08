function isDebug() {
  return process.argv.includes('-d') || process.argv.includes('--debug') ? true : false
}
export default isDebug