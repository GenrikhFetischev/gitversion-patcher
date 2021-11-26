import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { execShellCommand } from "./execShellCommand";

const execGitVersion = async (): Promise<string> => {
  const commandOutput = await execShellCommand("gitversion");

  if (commandOutput.exitCode !== 0) {
    throw Error(
      `Error, 'gitversion' command exited with code ${commandOutput.exitCode}`
    );
  }

  return commandOutput.stdout.join("");
};

const tryToParseGitversionStdout = (
  stdout: string
): Record<string, string> | null => {
  try {
    return JSON.parse(stdout);
  } catch (e) {
    console.error("\x1b[31m", "Error while parsing gitversion result");
    console.error(e);
    return null;
  }
};

const tryToGetVersionViaRegexp = (stdout: string): string | null => {
  const match = stdout.match(/FullSemVer.+(\d+\.\d+\.\d+)(.+)?"/);
  const result = `${match?.[1] === undefined ? "" : match?.[1]}${
    match?.[2] === undefined ? "" : match?.[2]
  }`;
  return result === "" ? null : result;
};

const readPackageJson = (
  pathToPackageJson: string
): Record<string, string> => {
  try {
    return JSON.parse(readFileSync(pathToPackageJson, { encoding: "utf8" }));
  } catch (e) {
    console.error("\x1b[31m", "Error while reading package.json");
    throw e;
  }
};

const patchPackageJson = (
  version: string,
  packageJsonContent: Record<string, string>,
  pathToPackageJson: string
) => {
  packageJsonContent.version = version;
  writeFileSync(pathToPackageJson, JSON.stringify(packageJsonContent, null, 2));
};

(async () => {
  const gitversionOut = await execGitVersion();
  if (!gitversionOut) {
    return;
  }

  const fullSemver =
    tryToParseGitversionStdout(gitversionOut)?.FullSemVer ??
    tryToGetVersionViaRegexp(gitversionOut);

  if (!fullSemver) {
    throw Error("Couldn't get full semver");
  }

  const pathToPackageJson = resolve("./package.json");

  const packageJsonContent = readPackageJson(pathToPackageJson);

  patchPackageJson(fullSemver, packageJsonContent, pathToPackageJson);

  console.log("\x1b[32m", "Done! 🎾");
})();

