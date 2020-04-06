import { exec } from "../shell";

export const commit = async (message: string) => {
  try {
    await exec("git add -A");
    await exec(`git commit -m "${message}"`);
    return true;
  } catch (e) {
    return false;
  }
};
