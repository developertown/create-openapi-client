import { popd, pushd } from "shelljs";

export default async function <T>(directory: string, fn: () => Promise<T>): Promise<void> {
  try {
    pushd("-q", directory);
    await fn();
  } finally {
    popd("-q");
  }
}
