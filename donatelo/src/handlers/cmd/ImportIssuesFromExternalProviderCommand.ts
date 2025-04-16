import { ConsoleLogger } from "@adapters/common/ConsoleLogger";
import { Engine } from "@adapters/Engine";
import { ConfigRepository } from "database/repostories/ConfigRepository";
import { IssueRepository } from "database/repostories/IssueRepository";
import { ImportIssuesFromExternalProvider } from "features/ImportIssuesFromExternalProvider";
import yargs from "yargs";

export class ImportIssuesFromExternalProviderCommand {
  static Command(): yargs.CommandModule {
    return {
      command: "import-issues",
      describe: "import issues from external provider",
      handler: async () => {
        try {
          const feature = new ImportIssuesFromExternalProvider({
            logger: new ConsoleLogger(),
            configRepository: new ConfigRepository(
              (
                await Engine.getInstance().getPostgresDataSource()
              ).getDataSource(),
            ),
            issueRepository: new IssueRepository(
              (
                await Engine.getInstance().getPostgresDataSource()
              ).getDataSource(),
            ),
            issueExternalProvider:
              await Engine.getInstance().getJiraExternalProvider(),
          });
          await feature.run();
        } catch (e) {
          console.log(e);
          (await Engine.getInstance().getPostgresDataSource()).destroy();
          process.exit(1);
        }
      },
    };
  }
}
