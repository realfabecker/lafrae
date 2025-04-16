import { Engine } from "@adapters/Engine";
import { DomainSerializer } from "core/domain/DomainSerializer";
import { IssueRepository } from "database/repostories/IssueRepository";
import { SearchForIssuesWithPagedOutput } from "features/SearchForIssuesWithPagedOutput";
import yargs from "yargs";

export class SearchForIssuesWithPagedOutputCommand {
  static Command(): yargs.CommandModule {
    return {
      command: "search-issues",
      describe: "searh for issues with filter by status paginated",
      handler: async () => {
        try {
          const feature = new SearchForIssuesWithPagedOutput({
            issueRepository: new IssueRepository(
              (
                await Engine.getInstance().getPostgresDataSource()
              ).getDataSource(),
            ),
          });
          const page = await feature.run();
          const data = DomainSerializer.serialize(page);
          console.log(JSON.stringify(data, null, "  "));
        } catch (e) {
          console.log(e);
          (await Engine.getInstance().getPostgresDataSource()).destroy();
          process.exit(1);
        }
      },
    };
  }
}
