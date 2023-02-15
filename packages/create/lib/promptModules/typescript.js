export default (cli) => {
  cli.injectFeature({
    name: 'TypeScript',
    value: 'TypeScript',
    description: 'Add support for the TypeScript'
  })
  cli.onPromptComplete((answers, opts) => {
    if (answers.features?.includes('TypeScript')) {
      opts.plugins['@fxjzz-cli/cli-plugin-typescript'] = {}
    }
  })
}