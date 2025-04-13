import { Config as DomainConfig } from "core/domain/config/Config";
import { Config as ConfigEntity } from "database/entities/Config";

export class ConfigMapper {
  public static toPersistence(config: DomainConfig): ConfigEntity {
    const issueEntity = new ConfigEntity();
    issueEntity.id = config.getId();
    issueEntity.provider = config.getProvider();
    issueEntity.config = config.getConfig();
    return issueEntity;
  }

  public static toDomain(config: ConfigEntity): DomainConfig {
    const domainConfig = new DomainConfig();
    domainConfig.setId(config.id);
    domainConfig.setProvider(config.provider);
    domainConfig.setConfig(config.config);
    return domainConfig;
  }
}
