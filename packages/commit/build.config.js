import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./lib/index"],
  failOnWarn: false,
});
