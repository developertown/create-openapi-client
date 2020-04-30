import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import * as globby from "globby";
import * as Listr from "listr";
import * as git from "./git";
import { exec, performInDirectory } from "./shell";
import { PackageInfo } from "./getPackageInfo";

type OpenApiClientOptions = PackageInfo & {
  packageDirectory: string;
  openapiUrl: string;
};

const createOpenApiClient = async ({ packageDirectory, ...options }: OpenApiClientOptions) => {
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
          const content = template(options);
          const fileRelativePath = path.relative(templateDirectory, templateFile).replace(/\\/g, "/");
          const destinationFileRelativePath = path.join(packageDirectory, fileRelativePath);
          const { dir: destinationDirectory, ext } = path.parse(destinationFileRelativePath);
          const destinationFile =
            ext === ".hbs" ? destinationFileRelativePath.replace(/.hbs/g, "") : destinationFileRelativePath;
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
        return performInDirectory(packageDirectory, async () => {
          await exec("yarn generate");
          await exec("yarn build");
        });
      },
    },
    {
      title: "Initialized a git repository.",
      task: (ctx, task) => {
        const gitIgnorePath = path.join(packageDirectory, ".gitignore");
        performInDirectory(packageDirectory, async () => {
          const hasGit = await git.isInstalled();
          if (hasGit) {
            const alreadyInitialized = await git.isInitialized();
            if (!alreadyInitialized) {
              await git.init();
              fs.writeFileSync(
                gitIgnorePath,
                `
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# production
/dist

# misc
npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,
                `utf8`,
              );
              await git.commit("Initialize project using create openapi client");
            } else {
              task.skip("git repository is already initialized");
            }
          } else {
            task.skip("git is not available");
          }
        });
      },
    },
  ]);
  await tasks.run();
};

export default createOpenApiClient;
