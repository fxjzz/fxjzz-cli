export default (api, options, answers) => {
  api.extendPackage({
    devDependencies: {
      "@commitlint/cli": "^17.4.4",
      "@commitlint/config-conventional": "^17.4.4",
      commitlint: "^17.4.4",
      husky: "^8.0.3",
      "lint-staged": "^13.2.0",
    },
    scripts: {
      prepare: "husky install",
    },
    "lint-staged": {
      "**/*.{js,jsx,tsx,ts,vue}": ["npm run lint:script", "git add ."],
      "**/*.{scss,css}": ["npm run lint:style", "git add ."],
    },
  });
  api.render("./template", { plugin: "cli-plugin-git-hooks" });
};
