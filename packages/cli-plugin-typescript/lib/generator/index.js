export default (api, options, answers) => {
  const hasTypeScript = answers.features?.includes("TypeScript");
  if (hasTypeScript && answers.preset === "React") {
    api.render("./template/template-react-ts", {
      plugin: "cli-plugin-typescript",
    });
    api.extendPackage({
      devDependencies: {
        typescript: "^4.9.3",
      },
    });
  } else {
    api.render("./template/template-vue-ts", {
      plugin: "cli-plugin-typescript",
    });
    api.extendPackage({
      devDependencies: {
        typescript: "^4.9.3",
        "vue-tsc": "^1.0.24",
      },
    });
  }
};
