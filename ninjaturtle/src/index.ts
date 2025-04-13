import { ConsoleLogger } from "@adapters/common/ConsoleLogger";
import { Engine } from "@adapters/Engine";
import { DomainSerializer } from "core/domain/DomainSerializer";
import { ConfigRepository } from "database/repostories/ConfigRepository";
import { IssueRepository } from "database/repostories/IssueRepository";
import { ImportIssuesFromExternalProvider } from "features/ImportIssuesFromExternalProvider";
import { SearchForIssuesWithPagedOutput } from "features/SearchForIssuesWithPagedOutput";

(async () => {
  try {
    const feature = new SearchForIssuesWithPagedOutput({
      issueRepository: new IssueRepository(
        (await Engine.getInstance().getPostgresDataSource()).getDataSource(),
      ),
    });
    const page = await feature.run();
    const data = DomainSerializer.serialize(page);
    console.log(JSON.stringify(data, null, "  "));
  } catch (e) {
    console.log(e);
    (await Engine.getInstance().getPostgresDataSource()).destroy();
  }
})();

// (async () => {
//   try {
//     const feature = new ImportIssuesFromExternalProvider({
//       logger: new ConsoleLogger(),
//       configRepository: new ConfigRepository(
//         (await Engine.getInstance().getPostgresDataSource()).getDataSource(),
//       ),
//       issueRepository: new IssueRepository(
//         (await Engine.getInstance().getPostgresDataSource()).getDataSource(),
//       ),
//       issueExternalProvider:
//         await Engine.getInstance().getJiraExternalProvider(),
//     });
//     await feature.run();
//   } catch (e) {
//     console.log(e);
//     (await Engine.getInstance().getPostgresDataSource()).destroy();
//   }
// })();
