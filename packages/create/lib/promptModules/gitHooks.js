export default (cli) => {
  cli.injectFeature({
    name: "gitHooks",
    value: "gitHooks",
    description: "review your code",
  });
  cli.onPromptComplete((answers, opts) => {
    if (answers.features?.includes("gitHooks")) {
      opts.plugins["@fxjzz-cli/cli-plugin-git-hooks"] = {};
    }
  });
};
