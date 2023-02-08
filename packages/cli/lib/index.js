import createInitCommand from '@fxjzz-cli/init'
import createCLI from './createCLI.js';
import './exception.js'

export default function () {
  const program = createCLI()
  createInitCommand(program)
  program.parse(process.argv)
}