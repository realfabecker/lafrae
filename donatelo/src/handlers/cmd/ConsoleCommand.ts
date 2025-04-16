import yargs from "yargs";
import * as process from "process";
import { ImportIssuesFromExternalProviderCommand } from "./ImportIssuesFromExternalProviderCommand";
import { GetIssueDetailByInternalIssueIdCommand } from "./GetIssueDetailByInternalIssueIdCommand";
import { SearchForIssuesWithPagedOutputCommand } from "./SearchForIssuesWithPagedOutputCommand";

export class ConsoleCommand {
  async run(): Promise<any> {
    try {
      await yargs(process.argv.slice(2))
        .command(ImportIssuesFromExternalProviderCommand.Command())
        .command(GetIssueDetailByInternalIssueIdCommand.Command())
        .command(SearchForIssuesWithPagedOutputCommand.Command())
        .demandCommand()
        .parseAsync();
    } catch (e) {
      console.log(`err : ${(<Error>e).message}`);
      process.exit(1);
    }
  }
}
