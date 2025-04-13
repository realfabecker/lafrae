import { IConfigReader } from "core/ports/IConfigReader";
import { YamlConfigReader } from "./configuration/YamlConfigReader";
import { PostgresDataSource } from "../database/datasource/PostgresDataSource";
import { JiraHttpIssueProvider } from "./external/JiraHttpIssueProvider";

export class Engine {
  private static instance: Engine;
  private constructor(private readonly configReader: IConfigReader) {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Engine(new YamlConfigReader("config.prod.yml"));
    }
    return this.instance;
  }

  public async getPostgresDataSource(): Promise<PostgresDataSource> {
    const appConfig = this.configReader.getConfig();
    return PostgresDataSource.init(appConfig.database.provider);
  }

  public async getJiraExternalProvider(): Promise<JiraHttpIssueProvider> {
    const providerConfig = this.configReader.getConfig().external.provider;
    return new JiraHttpIssueProvider(providerConfig.config);
  }
}
