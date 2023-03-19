import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import getDeps from "./eslintDeps.js";
import getOpts from "./eslintOptions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (api, options, answers) => {
  const devDependencies = getDeps(answers);
  const opts = getOpts(answers);
  fs.writeFileSync(
    path.resolve(__dirname, "../template/.eslintrc"),
    JSON.stringify(opts, null, 2)
  );
  api.extendPackage({
    devDependencies: {
      "eslint-config-prettier": "^8.7.0",
      "eslint-plugin-prettier": "^4.2.1",
      prettier: "^2.8.4",
      ...devDependencies,
    },
    scripts: {
      "lint:script": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./",
    },
  });
  api.render("./template", { plugin: "cli-plugin-linter" });
};
