import { Engine } from "@adapters/Engine";
import { DomainSerializer } from "core/domain/DomainSerializer";
import { IssueRepository } from "database/repostories/IssueRepository";
import { GetIssueDetailsByInternalIssueId } from "features/GetIssueDetailsByInternalIssueId";
import yargs from "yargs";

export class GetIssueDetailByInternalIssueIdCommand {
  static Command(): yargs.CommandModule {
    return {
      command: "detail-issue",
      describe: "get issue detail by its internal id",
      handler: async () => {
        try {
          const feature = new GetIssueDetailsByInternalIssueId({
            issueRepository: new IssueRepository(
              (
                await Engine.getInstance().getPostgresDataSource()
              ).getDataSource(),
            ),
          });
          const page = await feature.run(
            "579941ad-de97-4b5e-8175-2354a8cef6c5",
          );
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
