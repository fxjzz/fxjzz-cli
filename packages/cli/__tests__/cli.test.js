import path from 'node:path'
import { execa } from 'execa'

const CLI = path.join(__dirname, '../bin/cli.js')
const bin = () => () => execa(CLI)

test('command error', () => {
  bin()()
})
