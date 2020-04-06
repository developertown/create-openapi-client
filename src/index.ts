import { Command, flags } from "@oclif/command";
import * as path from "path";
import createOpenApiClient from "./createOpenApiClient";
import getPackageInfo from "./getPackageInfo";

class CreateOpenapiClient extends Command {
  public static description = "Creates an openapi client library";

  public static examples = ["$ create-openapi-client petstore-api https://petstore.swagger.io/v2/swagger.json"];

  public static flags = {
    description: flags.string({
      char: "d",
      description: "Package description",
      required: false,
    }),
    version: flags.string({
      char: "v",
      description: "Package description",
      required: false,
    }),
    author: flags.string({
      char: "a",
      description: "Package author name",
      required: false,
    }),
    repository: flags.string({
      char: "r",
      description: "Package repository url",
      required: false,
    }),
    license: flags.string({
      char: "l",
      description: "Package license",
      required: false,
    }),
  };

  public static args = [
    { name: "name", description: "Package name (petstore-api)", required: true },
    {
      name: "openapiUrl",
      description: "OpenAPI Specification (https://petstore.swagger.io/v2/swagger.json)",
      required: true,
    },
  ];

  public async run(): Promise<void> {
    const {
      args: { name, openapiUrl },
      flags,
    } = this.parse(CreateOpenapiClient);

    const packageInfo = await getPackageInfo({ name, ...flags });
    const packageDirectory = path.join(process.cwd(), name);

    await createOpenApiClient({ packageDirectory, openapiUrl, ...packageInfo });
  }
}

export = CreateOpenapiClient;
