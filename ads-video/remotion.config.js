import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Use the machine's installed Chrome instead of Remotion's own
// auto-downloaded chrome-headless-shell, which some antivirus/SmartScreen
// setups silently block on first launch (fresh unsigned executable).
Config.setBrowserExecutable(
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
);
