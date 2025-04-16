#!/usr/bin/env node
import { ConsoleCommand } from "handlers/cmd/ConsoleCommand";

(async () => {
  const app = new ConsoleCommand();
  await app.run();
})();
