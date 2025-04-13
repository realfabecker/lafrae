import { Config as DomainConfig } from "core/domain/config/Config";
import { IssueProvider } from "core/domain/issues/enums/IssueProvider";

export interface IConfigRepository {
  save(config: DomainConfig): Promise<DomainConfig>;
  create(config: DomainConfig): Promise<DomainConfig>;
  update(config: DomainConfig): Promise<DomainConfig>;
  findByProviderId(
    providerId: IssueProvider.JIRA,
  ): Promise<DomainConfig | null>;
}
