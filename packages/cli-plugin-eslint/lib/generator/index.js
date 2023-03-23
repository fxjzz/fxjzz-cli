import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
import getDeps from "./eslintDeps.js";
import config from "./eslintOptions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (api, options, answers) => {
  const tsorjs = answers.features.includes("TypeScript") ? "ts" : "js";
  const devDependencies = getDeps(answers);
  const eslintConfig = config(answers);
  fs.writeFileSync(
    path.resolve(__dirname, "../template/.eslintrc"),
    JSON.stringify(eslintConfig, null, 2)
  );
  api.render("./template", { plugin: "cli-plugin-eslint" });
  api.extendPackage({
    devDependencies: {
      ...devDependencies,
    },
    scripts: {
      "lint:script": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./",
    },
  });
  api.injectImport(`vite.config.${tsorjs}`, {
    import: "viteEslint",
    from: "vite-plugin-eslint",
  });
};
