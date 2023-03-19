const depsMap = {
  React: {
    eslint: "^8.36.0",
    "eslint-plugin-react": "^7.32.2",
  },
  Vue: {
    eslint: "^8.36.0",
    "eslint-plugin-vue": "^9.9.0",
  },
};

const getDeps = (answers) => {
  const { preset } = answers;
  const isTs = answers.features.includes("TypeScript");
  const tsdeps = {
    "@typescript-eslint/eslint-plugin": "^5.55.0",
    "@typescript-eslint/parser": "^5.55.0",
  };
  const deps = {
    ...depsMap[preset],
    ...(isTs ? tsdeps : undefined),
  };
  return deps;
};

export default getDeps;
