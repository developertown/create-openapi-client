import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import * as globby from "globby";
import * as Listr from "listr";
import { exec, performInDirectory } from "./shell";
import { PackageInfo } from "./getPackageInfo";

const createOpenApiClient = async (packageDirectory: string, packageInfo: PackageInfo) => {
  const tasks = new Listr([
    {
      title: "Creating openapi client package",
      task: async () => {
        const templateDirectory = path.join(__dirname, "..", "template");
        const templateFiles = await globby(templateDirectory.replace(/\\/g, "/"), {
          dot: true,
        });

        templateFiles.forEach((templateFile) => {
          const template = handlebars.compile(fs.readFileSync(templateFile, "utf8"));
          const content = template({
            ...packageInfo,
          });
          const fileRelativePath = path.relative(templateDirectory, templateFile).replace(/\\/g, "/");
          const destinationFile = path.join(packageDirectory, fileRelativePath);
          const destinationDirectory = path.parse(destinationFile).dir;
          if (!fs.existsSync(destinationDirectory)) {
            fs.mkdirSync(destinationDirectory);
          }
          fs.writeFileSync(destinationFile, content, "utf8");
        });
      },
    },
    {
      title: "Initializing npm dependencies. This will take a minute.",
      task: () => {
        return performInDirectory(packageDirectory, () => exec("yarn install"));
      },
    },
    {
      title: "Generate openapi client",
      task: () => {
        return performInDirectory(packageDirectory, () => exec("yarn generate"));
      },
    },
  ]);
  await tasks.run();
};

export default createOpenApiClient;
