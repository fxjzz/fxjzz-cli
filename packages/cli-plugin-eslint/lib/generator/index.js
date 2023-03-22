import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
import getDeps from "./eslintDeps.js";
import config from "./eslintOptions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (api, options, answers) => {
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
  });
};
