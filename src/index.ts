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

  let fullSemVer: string = "";

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
    fullSemVer = gitversionOut.FullSemVer;
  } catch (e) {
    console.error("\x1b[31m", "Error while parsing gitversion result");
    console.error(tryToCallGitVersion.stdout[0]);
    console.log(tryToCallGitVersion.stdout);
  }

  console.log("Try to get FullSemVer via regexp");
  const match = tryToCallGitVersion.stdout
    .join("")
    .match(/FullSemVer.+(\d.\d.\d.+)"/);

  fullSemVer = match[1] ? match[1] : undefined;

  if (!fullSemVer) {
    throw Error("can't parse full semver via regexp");
  }

  packageJsonContent.version = fullSemVer;

  writeFileSync(pathToPackageJson, JSON.stringify(packageJsonContent, null, 2));
  console.log("\x1b[32m", "Done! 🎾");
})();
