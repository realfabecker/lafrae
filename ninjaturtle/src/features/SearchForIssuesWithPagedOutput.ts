import { DomainResult } from "core/domain/DomainResult";
import { DomainSerializer } from "core/domain/DomainSerializer";
import { IssueListFilter } from "core/domain/filters/IssueListFilters";
import { IssueStatus } from "core/domain/issues/enums/IssueStatus";
import { SearchableIssue } from "core/domain/issues/SearchableIssue";
import { Page } from "core/domain/paged/Page";
import { IssueRepository } from "database/repostories/IssueRepository";

type SearchForIssuesWithPagedOutputOpts = {
  issueRepository: IssueRepository;
};

export class SearchForIssuesWithPagedOutput {
  constructor(private readonly opts: SearchForIssuesWithPagedOutputOpts) {}

  public async run(): Promise<DomainResult<Page>> {
    try {
      const filter = new IssueListFilter({
        page: 1,
        page_size: 10,
        status: IssueStatus.Para_Desenvolvimento,
      });
      const records = (await this.opts.issueRepository.list(filter)).map(
        (h) => {
          return new SearchableIssue(DomainSerializer.serialize(h));
        },
      );
      return DomainResult.OK(
        Page.fromList({
          items: records,
          page: filter.getPage(),
          page_size: filter.getPageSize(),
          total: await this.opts.issueRepository.count(filter),
        }),
      );
    } catch (e) {
      return DomainResult.Error(<Error>e);
    }
  }
}
