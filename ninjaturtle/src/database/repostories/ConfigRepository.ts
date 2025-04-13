import { DataSource } from "typeorm";
import { ConfigMapper } from "@adapters/mappers/ConfigMapper";
import { Config as DomainConfig } from "core/domain/config/Config";
import { Config as ConfigEntity } from "database/entities/Config";
import { IssueProvider } from "core/domain/issues/enums/IssueProvider";
import { IConfigRepository } from "core/ports/IConfigRepository";

export class ConfigRepository implements IConfigRepository {
  constructor(private readonly d: DataSource) {}

  public async save(config: DomainConfig): Promise<DomainConfig> {
    if (config.getId()) {
      return this.update(config);
    }
    return this.create(config);
  }

  public async create(config: DomainConfig): Promise<DomainConfig> {
    const configEntity = ConfigMapper.toPersistence(config);
    await this.d.getRepository(ConfigEntity).save(configEntity);
    config.setId(configEntity.id);
    return config;
  }

  public async update(config: DomainConfig): Promise<DomainConfig> {
    const configEntity = ConfigMapper.toPersistence(config);
    await this.d
      .getRepository(ConfigEntity)
      .update({ id: config.getId() }, configEntity);
    return config;
  }

  public async findByProviderId(
    providerId: IssueProvider.JIRA,
  ): Promise<DomainConfig | null> {
    const configEntity = await this.d
      .getRepository(ConfigEntity)
      .findOneBy({ provider: providerId });
    if (!configEntity) return null;
    return ConfigMapper.toDomain(configEntity);
  }
}
