export default (cli) => {
  cli.injectFeature({
    name: "stylelint",
    value: "stylelint",
    description: "check your css code",
  });
  cli.onPromptComplete((answers, opts) => {
    if (answers.features?.includes("stylelint")) {
      opts.plugins["@fxjzz-cli/cli-plugin-stylelint"] = {};
    }
  });
};
