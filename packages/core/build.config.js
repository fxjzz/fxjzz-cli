import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./bin/f"],
  failOnWarn: false,
});
