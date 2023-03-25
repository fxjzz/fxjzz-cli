import path from "node:path";
import fse from "fs-extra";
import figlet from "figlet";
import inquirer from "inquirer";
import chalk from "chalk";
import validateProjectName from "validate-npm-package-name";
import { log } from "@fxjzz-cli/utils";
import Creator from "./Creator.js";

async function create(projectName, opts) {
  const cwd = process.cwd(); //终端当前目录

  //to do think
  const inCurrent = projectName === ".";
  const name = inCurrent ? path.relative("../", cwd) : projectName;

  const targetDir = path.resolve(cwd, projectName || ".");

  //检测项目名称合法性
  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    log.error(`Invalid project name:${name}`);
    result.errors?.forEach((err) => {
      log.error(`Error: ${err}`);
    });
    result.warnings?.forEach((w) => {
      log.error(`Warning: ${w}`);
    });
    process.exit(1);
  }

  if (fse.existsSync(targetDir)) {
    if (opts.force) {
      await fse.remove(targetDir);
    } else if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: "ok",
          type: "confirm",
          message: "generate project in current directory?",
        },
      ]);
      if (!ok) {
        return;
      }
    } else {
      const { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: `Target directory ${chalk.cyan(
            targetDir
          )} already exists. Pick an action:`,
          choices: [
            { name: "Overwrite", value: "overwrite" },
            { name: "Cancel", value: false },
          ],
        },
      ]);
      if (action === "overwrite") {
        log.info(`\nRemoving ${chalk.cyan(targetDir)}...`);
        await fse.remove(targetDir);
      }
    }
  }
  if (!inCurrent) {
    await fse.mkdir(targetDir);
  }
  console.log(
    chalk.yellow(
      figlet.textSync("F-CLI", {
        horizontalLayout: "full",
        font: "3D-ASCII",
        verticalLayout: "default",
        width: 120,
        whitespaceBreak: true,
      })
    )
  );
  const creator = new Creator(name, targetDir);

  await creator.create(opts);
}

export default create;

