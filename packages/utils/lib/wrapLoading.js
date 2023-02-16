import ora from 'ora'

export default async (fn, message) => {
  const spinner = ora(message)
  spinner.start()
  try {
    await fn()
    spinner.succeed()
  } catch (e) {
    spinner.fail(`Installing additional dependencies failed,${e}`)
  }
}