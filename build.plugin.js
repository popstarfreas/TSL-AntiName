import fs from "node:fs";
import child_process from "node:child_process";

child_process.execSync("pnpm i --production=true ../../pluginreference", { stdio: "inherit" })
child_process.execSync("pnpm run build", { stdio: "inherit" })
child_process.execSync("pnpm run build:packed", { stdio: "inherit" })
fs.renameSync("./output", "./plugin")
