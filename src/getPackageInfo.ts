import { prompt } from "inquirer";

export enum Package {
  description = "description",
  version = "version",
  author = "author",
  repository = "repository",
  license = "license",
}

export type PackageInfo = {
  name?: string;
  description?: string;
  version?: string;
  author?: string;
  repository?: string;
  license?: string;
};

const getPackageInfo = async ({ name, ...flags }: PackageInfo) => {
  const info = await prompt([
    {
      type: "input",
      name: Package.description,
      message: "Package description",
      default: flags.description || `Typescript openapi client for ${name}`,
    },
    {
      type: "input",
      name: Package.version,
      message: "Package version",
      default: flags.version || "1.0.0",
    },
    {
      type: "input",
      name: Package.author,
      message: flags.author || "Package author name",
    },
    {
      type: "input",
      name: Package.repository,
      message: flags.repository || "Package repository url",
    },
    {
      type: "input",
      name: Package.license,
      message: "Package license",
      default: flags.license || "MIT",
    },
  ]);
  return { name, ...info };
};

export default getPackageInfo;
