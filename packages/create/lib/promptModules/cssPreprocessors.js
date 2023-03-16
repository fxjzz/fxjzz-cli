export default (cli) => {
  cli.injectFeature({
    name: "css-preprocessor",
    value: "css-preprocessor",
    description: "Add support for CSS css-preprocessor",
  });
  cli.injectPrompt({
    name: "cssPreprocessor",
    when: (answers) => answers.features.includes("css-preprocessor"),
    type: "list",
    message: "Pick a CSS pre-processor",
    choices: [
      {
        name: "Sass/SCSS (with dart-sass)",
        value: "sass",
      },
      {
        name: "Less",
        value: "less",
      },
      {
        name: "Stylus",
        value: "stylus",
      },
    ],
  });
  cli.onPromptComplete((answers, opts) => {
    if (answers.cssPreprocessor) {
      opts.plugins["@fxjzz-cli/cli-plugin-css-preprocessor"] = {};
    }
  });
};
