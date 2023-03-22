export default (cli) => {
  cli.injectFeature({
    name: "Linter / Formatter",
    value: "linter",
    description: "Check and enforce code quality with ESLint or Prettier",
    plugins: ["eslint"], //
  });
  // cli.injectPrompt({
  //   name: "eslintConfig",
  //   //nots + eslint === false
  //   when: (answers) =>
  //     answers.features?.includes("linter") &&
  //     answers.features?.includes("TypeScript"),
  //   type: "list",
  //   message: "Pick a linter / formatter config:",
  //   description:
  //     "Checking code errors and enforcing an homogeneous code style is recommended.",
  //   choices: [
  //     {
  //       name: "ESLint with error prevention only",
  //       value: "base",
  //       short: "Basic",
  //     },
  //     {
  //       name: "ESLint + Standard config",
  //       value: "standard",
  //       short: "Standard",
  //     },
  //     {
  //       name: "ESLint + XO config",
  //       value: "xo",
  //       short: "Standard",
  //     },
  //   ],
  // });
  cli.injectPrompt({
    name: "eslintConfig",
    //eslint
    when: (answers) => answers.features.includes("linter"),
    type: "list",
    message: "Pick a linter / formatter config:",
    description:
      "Checking code errors and enforcing an homogeneous code style is recommended.",
    choices: [
      {
        name: "ESLint with error prevention only",
        value: "base",
        short: "Basic",
      },
      {
        name: "ESLint + Airbnb config",
        value: "airbnb",
        short: "Airbnb",
      },
      {
        name: "ESLint + Standard config",
        value: "standard",
        short: "Standard",
      },
      {
        name: "ESLint + XO config",
        value: "xo",
        short: "XO",
      },
    ],
  });

  cli.onPromptComplete((answers, opts) => {
    if (answers.features?.includes("linter")) {
      opts.plugins["@fxjzz-cli/cli-plugin-eslint"] = {
        config: answers.eslintConfig,
      };
    }
  });
};
