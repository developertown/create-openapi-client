import { exec } from "shelljs";

export default function (command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { silent: true }, (code: number, stdout: string, stderror) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(stderror || `An error occurred while executing ${command}`);
      }
    });
  });
}
