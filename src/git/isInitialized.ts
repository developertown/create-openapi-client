import { exec } from "../shell";

export const isInitialized = async () => {
  try {
    await exec("git rev-parse --is-inside-work-tree");
    return true;
  } catch (e) {
    return false;
  }
};
