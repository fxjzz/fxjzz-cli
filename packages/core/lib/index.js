import fs from "node:fs";
import semver from "semver";
import { program } from "commander";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { log } from "@fxjzz-cli/utils";
import create from "@fxjzz-cli/create";
import createCommitCommand from "@fxjzz-cli/commit";

//当前终端目录
const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const requiredVersion = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8")
).engines.node;

function checkNodeVersion(needVersion) {
  if (
    !semver.satisfies(process.version, needVersion, { includePrerelease: true })
  ) {
    log.error(
      `You are using Node ${process.version}, but this version of @fxjzz-cli requires Node ${needVersion}.\nPlease upgrade your Node version.`
    );
    process.exit(1);
  }
}

export default function (argv) {
  checkNodeVersion(requiredVersion);

  program
    .command("create <name>")
    .description("create a vite project")
    .option("-f, --force", "overwrite target directory if it exists")
    .option("-n, --no-git", "skip git initialization")
    .action((name, opts) => {
      create(name, opts);
    });

  createCommitCommand(program);
  program.parse(process.argv);
}

