import { exec } from "../shell";

export const init = async () => {
  try {
    await exec("git init");
    return true;
  } catch (e) {
    return false;
  }
};
