import { ConsoleRootCommand } from "src/handlers/commands/ConsoleRootCommand";

(async () => {
  await new ConsoleRootCommand().run();
})();
