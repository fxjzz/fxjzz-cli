export default (cli) => {
  cli.injectFeature({
    name: "linter",
    value: "linter",
    description: "check your code",
  });
  cli.onPromptComplete((answers, opts) => {
    if (answers.features?.includes("linter")) {
      opts.plugins["@fxjzz-cli/cli-plugin-linter"] = {};
    }
  });
};
