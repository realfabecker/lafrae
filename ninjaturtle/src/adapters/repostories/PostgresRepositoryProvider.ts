import { DataSource } from "typeorm";
import { IssueRepository } from "./postgres/IssueRepository";
import { IRepositoryProvider } from "core/ports/IRepositoryProvider";
import * as util from "node:util";

export class PostgresRepositoryProvider implements IRepositoryProvider {
  private constructor(private readonly d: DataSource) {}

  public static async init(
    config: Record<string, any>,
  ): Promise<IRepositoryProvider> {
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
    return new PostgresRepositoryProvider(d);
  }

  public getIssueRepository(): IssueRepository {
    return new IssueRepository(this.d);
  }

  public destroy(): Promise<void> {
    return this.d.destroy();
  }
}
