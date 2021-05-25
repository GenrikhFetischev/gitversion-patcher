import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { execShellCommand } from "./execShellCommand";

(async () => {
  const tryToCallGitVersion = await execShellCommand("gitversion");

  if (tryToCallGitVersion.exitCode !== 0) {
    console.log(
      "\x1b[31m",
      `Error, 'gitversion' command exited with code ${tryToCallGitVersion.exitCode}`
    );
    return;
  }

  let gitversionOut: { [key: string]: string };
  let packageJsonContent: { [key: string]: string };

  const pathToPackageJson = resolve("./package.json");

  try {
    packageJsonContent = JSON.parse(
      readFileSync(pathToPackageJson, { encoding: "utf8" })
    );
  } catch (e) {
    console.error("\x1b[31m", "Error while reading package.json");
    throw e;
  }

  try {
    gitversionOut = JSON.parse(tryToCallGitVersion.stdout[0]);
  } catch (e) {
    console.error("\x1b[31m", "Error while parsing gitversion result");
    console.error(tryToCallGitVersion.stdout[0]);
    console.log(tryToCallGitVersion.stdout);
    throw e;

  }

  packageJsonContent.version = gitversionOut.FullSemVer;

  writeFileSync(pathToPackageJson, JSON.stringify(packageJsonContent, null, 2));
  console.log("\x1b[32m", "Done! 🎾");
})();
