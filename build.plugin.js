var fs = require("fs");
var child_process = require("child_process");

child_process.execSync("npm i ../../pluginreference", { stdio: "inherit" })
child_process.execSync("npm run build", { stdio: "inherit" })
child_process.execSync("npm run build:packed", { stdio: "inherit" })
fs.renameSync("./output", "./plugin")
