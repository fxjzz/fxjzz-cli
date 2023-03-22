const config = (answers) => {
  const { eslintConfig, preset } = answers;
  const isHasTypeScript = answers.features?.includes("TypeScript");

  const defaultConfig = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      `plugin:${
        preset === "React" ? "react/recommended" : "vue/vue3-essential"
      }`,
      `${eslintConfig}`,
    ],
    overrides: [],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: [`${preset.toLowerCase()}`],
    rules: {},
  };
  if (eslintConfig === "airbnb" && preset === "Vue") {
    defaultConfig.extends = ["plugin:vue/vue3-essential", "airbnb-base"];
  }
  if (eslintConfig === "base") {
    defaultConfig.extends[1] = "eslint:recommended";
  }
  if (isHasTypeScript) {
    if (eslintConfig === "standard") {
      defaultConfig.extends[1] = "standard-with-typescript";
    } else if (eslintConfig === "xo") {
      defaultConfig.extends[1] = "xo";
      defaultConfig.overrides.push({
        extends: ["xo-typescript"],
        files: ["*.ts", "*.tsx"],
      });
    }
  }

  return defaultConfig;
};
export default config;
