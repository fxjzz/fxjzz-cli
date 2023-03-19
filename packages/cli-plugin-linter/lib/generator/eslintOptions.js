const options = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended"],
  overrides: [],
  parser: "",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [],
  rules: {},
};

const getOpts = (answers) => {
  const { preset } = answers;
  const isTs = answers.features.includes("TypeScript");
  options["plugins"].push("prettier");

  if (preset === "React") {
    options["extends"].push("plugin:react/recommended");
    options["plugins"].push("react");
  } else {
    options["plugins"].push("vue");
    options["extends"].push("plugin:vue/vue3-essential");
  }
  if (isTs) {
    options["plugins"].push("@typescript-eslint");
    options.parser = "@typescript-eslint/parser";
  }

  return options;
};

export default getOpts;
