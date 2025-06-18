import yargs from "yargs";
import { GoogleOpenIdProvider } from "../../../src/adapters/providers/GoogleOpenIdProvider";
import { OpenIdAuthDynamoRepository } from "../../../src/database/dynamodb/repositories/OpenIdAuthDynamoRepository";
import { AuthorizaOpenIdGoogleCmdline } from "../../../src/features/AuthorizeOpenIdGoogleCmdline";
import { ConsoleLogger } from "../../../src/adapters/providers/ConsoleLogger";

export class GoogleLoginCommand {
  static Command(): yargs.CommandModule {
    return {
      command: "google-login",
      describe: "google-login",
      builder: (yargs) => {
        yargs.option("user-id", {
          demandOption: false,
          default: "868d9ff5-e61f-4c82-ac09-97d20562ac77",
        });
        yargs.option("client-id", {
          demandOption: false,
          default: process.env.GOOGLE_CLIENT_ID,
        });
        yargs.option("client-secret", {
          demandOption: false,
          default: process.env.GOOGLE_CLIENT_SECRET,
        });
        yargs.option("callback-url", {
          demandOption: false,
          default: "http://localhost:3100/google/callback",
          coerce: (callbackUrl) => new URL(callbackUrl),
        });
        return yargs;
      },
      handler: async (args: yargs.ArgumentsCamelCase<any>) => {
        const repository = new OpenIdAuthDynamoRepository("sintese");
        const handler = new AuthorizaOpenIdGoogleCmdline({
          openIdProvider: new GoogleOpenIdProvider(
            repository,
            new ConsoleLogger(),
          ),
          openIdRepository: repository,
        });
        await handler.run({
          callbackUrl: args["callbackUrl"],
          clientId: args["clientId"],
          clientSecret: args["clientSecret"],
          userId: args["userId"],
        });
      },
    };
  }
}
