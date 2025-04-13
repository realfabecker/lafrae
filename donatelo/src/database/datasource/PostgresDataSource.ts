import { DataSource } from "typeorm";
import * as util from "node:util";

export class PostgresDataSource {
  private static instance: PostgresDataSource;
  private constructor(private readonly dataSource: DataSource) {}

  public static async init(
    config: Record<string, any>,
  ): Promise<PostgresDataSource> {
    if (!this.instance) {
      const url = util.format(
        "postgres://%s:%s@%s:%s/%s",
        ...[
          config.config?.username!,
          config.config?.password!,
          config.config?.host!,
          config.config?.port!,
          config.config?.dbname!,
        ],
      );
      const d = new DataSource({
        type: "postgres",
        url: url,
        migrations: config.config.migrations,
        entities: config.config.entities,
      });
      await d.initialize();
      this.instance = new PostgresDataSource(d);
    }
    return this.instance;
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }

  public destroy(): Promise<void> {
    return this.dataSource.destroy();
  }
}
