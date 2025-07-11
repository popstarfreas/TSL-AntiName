var fs = require("fs");
var child_process = require("child_process");

child_process.execSync("pnpm i ../../pluginreference", { stdio: "inherit" })
child_process.execSync("pnpm run build", { stdio: "inherit" })
child_process.execSync("pnpm run build:packed", { stdio: "inherit" })
fs.renameSync("./output", "./plugin")
