import { Engine } from "@adapters/Engine";
import { ImportIssuesFromExternalProvider } from "features/ImportIssuesFromExternalProvider";

(async () => {
  const provider = await Engine.getInstance().createExternalProvider();
  const database = await Engine.getInstance().createRepositoryProvider();

  try {
    const feature = new ImportIssuesFromExternalProvider(provider, database);
    await feature.run();
  } catch (e) {
    console.log(e);
  } finally {
    await database.destroy();
  }
})();
