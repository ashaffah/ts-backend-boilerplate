const os = require("os");

const platform = os.platform();

if (platform === "win32") {
  process.exit(0);
} else {
  process.exit(1);
}
