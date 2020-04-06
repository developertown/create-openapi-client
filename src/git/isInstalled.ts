import { exec } from "../shell";

export const isInstalled = async () => {
  try {
    await exec("git --version");
    return true;
  } catch (e) {
    return false;
  }
};
