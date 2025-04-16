import { DomainResult } from "core/domain/DomainResult";
import { IssueNotFoundError } from "core/domain/errors/IssueNotFoundError";
import { Issue } from "core/domain/issues/Issue";
import { IssueRepository } from "database/repostories/IssueRepository";

type GetIssueDetailByInternalIssueIdOpts = {
  issueRepository: IssueRepository;
};

export class GetIssueDetailsByInternalIssueId {
  constructor(private readonly opts: GetIssueDetailByInternalIssueIdOpts) {}

  public async run(internalId: string): Promise<DomainResult<Issue>> {
    try {
      const issue =
        await this.opts.issueRepository.findByInternalId(internalId);

      if (!issue) {
        return DomainResult.Error(new IssueNotFoundError());
      }

      return DomainResult.Ok(issue);
    } catch (e) {
      return DomainResult.Error(<Error>e);
    }
  }
}
