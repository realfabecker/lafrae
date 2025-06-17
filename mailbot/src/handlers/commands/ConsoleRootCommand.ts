import yargs from "yargs";
import { GoogleLoginCommand } from "./GoogleLoginCommand";

export class ConsoleRootCommand {
  public async run(): Promise<void> {
    try {
      await yargs(process.argv.slice(2))
        .usage("Usage $0 [options]")
        .command(GoogleLoginCommand.Command())
        .demandCommand()
        .parseAsync();
    } catch (e) {
      console.log(`err: ${(<Error>e).message}`);
      process.exit(1);
    }
  }
}
