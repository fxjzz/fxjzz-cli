export default (api, options, answers) => {
  api.extendPackage({
    scripts: {
      lint: "npm run lint:script && npm run lint:style",
      "lint:style": 'stylelint --fix "src/**/*.{css,scss}"',
    },
    devDependencies: {
      stylelint: "^15.3.0",
      "stylelint-prettier": "^3.0.0",
      "stylelint-config-prettier": "^9.0.5",
      "stylelint-config-recess-order": "^4.0.0",
      "stylelint-config-standard": "^31.0.0",
      "stylelint-config-standard-scss": "^7.0.1",
    },
  });
  api.render("./template", { plugin: "cli-plugin-stylelint" });
};
