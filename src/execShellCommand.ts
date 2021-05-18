import { exec } from "child_process";

export type ExecutionOutput = {
  stdout: string[];
  stderr: Error[];
  exitCode: number;
};

export const execShellCommand = async (
  command: string
): Promise<ExecutionOutput> => {
  let output: ExecutionOutput = {
    stdout: [],
    stderr: [],
    exitCode: 0,
  };

  return new Promise((resolve, _reject) => {
    const childProcess = exec(command);
    childProcess.stdout?.on("data", (data) => {
      output.stdout.push(data);
    });
    childProcess.stderr?.on("data", console.error);
    childProcess.addListener("exit", () => {
      output.exitCode = childProcess.exitCode;
      resolve(output);
    });
    childProcess.addListener("close", () => {
      output.exitCode = childProcess.exitCode;
      resolve(output);
    });
    childProcess.addListener("error", (error) => {
      output.exitCode = childProcess.exitCode;
      output.stderr.push(error);

      resolve(output);
    });
  });
};
