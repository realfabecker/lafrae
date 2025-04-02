import { IRepositoryProvider } from "core/ports/IRepositoryProvider";
import { PostgresRepositoryProvider } from "./repostories/PostgresRepositoryProvider";
import { HttpExternalProvider } from "./external/HttpExternalProvider";
import { IExternalProvider } from "core/ports/IExternalProvider";
import { IConfigReader } from "core/ports/IConfigReader";
import { YamlConfigReader } from "./configuration/YamlConfigReader";

export class Engine {
  private static instance: Engine;

  private constructor(private readonly configReader: IConfigReader) {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Engine(new YamlConfigReader("config.prod.yml"));
    }
    return this.instance;
  }

  public async createRepositoryProvider(): Promise<IRepositoryProvider> {
    const appConfig = this.configReader.getConfig();
    return await PostgresRepositoryProvider.init(appConfig.database.provider);
  }

  public async createExternalProvider(): Promise<IExternalProvider> {
    const appConfig = this.configReader.getConfig();
    return await HttpExternalProvider.init(appConfig.external.provider);
  }
}
