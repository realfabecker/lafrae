import { Config as DomainConfig } from "core/domain/config/Config";
import { IssuePaginateFilter } from "core/domain/jira/IssuePaginateFilter";
import { IssueProvider } from "core/domain/issues/enums/IssueProvider";
import { IConfigRepository } from "core/ports/IConfigRepository";
import { ILogger } from "core/ports/IConsoleLogger";
import { IExternalIssueProvider } from "core/ports/IExternalIssueProvider";
import { IIssueRepository } from "core/ports/IIssueRepository";
import { DomainResult } from "core/domain/DomainResult";

type ImportIssuesFromExternalProviderOpts = {
  logger: ILogger;
  issueExternalProvider: IExternalIssueProvider;
  issueRepository: IIssueRepository;
  configRepository: IConfigRepository;
};

export class ImportIssuesFromExternalProvider {
  constructor(private readonly opts: ImportIssuesFromExternalProviderOpts) {}

  public async run(): Promise<DomainResult> {
    try {
      let lastImportedIssueId = await this.getLastImportedIssueId();
      if (lastImportedIssueId) {
        this.opts.logger.info(
          `Sincronizando a partir de External-Id ${lastImportedIssueId}`,
        );
      } else {
        this.opts.logger.info(`Sincronizando a partir do início`);
      }
      for await (const issue of this.opts.issueExternalProvider.paginate(
        new IssuePaginateFilter({ lastIssueId: lastImportedIssueId }),
      )) {
        this.opts.logger.info(`${issue.getExternalId()}: Sincronizando Ticket`);
        await this.opts.issueRepository.save(issue);
        lastImportedIssueId = issue.getExternalId();
      }
      this.opts.logger.info("Finalizado fluxo para sicronização");
      if (lastImportedIssueId) {
        await this.saveLastImportedIssueId(lastImportedIssueId);
      }
      return DomainResult.OK();
    } catch (e) {
      return DomainResult.Error(<Error>e);
    }
  }

  protected async getLastImportedIssueId(): Promise<number | null> {
    const config = await this.getJiraProviderConfig();
    const lastImportedIssueId = config
      .getJiraProvider()
      .getLastImportedIssueId();
    return lastImportedIssueId || null;
  }

  protected async getJiraProviderConfig(): Promise<DomainConfig> {
    let jiraProviderConfig = await this.opts.configRepository.findByProviderId(
      IssueProvider.JIRA,
    );
    if (jiraProviderConfig !== null) {
      return jiraProviderConfig as unknown as DomainConfig;
    }
    jiraProviderConfig = new DomainConfig();
    jiraProviderConfig.setProvider(IssueProvider.JIRA);
    return jiraProviderConfig;
  }

  protected async saveLastImportedIssueId(lastImportedIssueId: number) {
    const config = await this.getJiraProviderConfig();
    config.getJiraProvider().setLastImportedIssueId(lastImportedIssueId);
    this.opts.configRepository.save(config);
  }
}
