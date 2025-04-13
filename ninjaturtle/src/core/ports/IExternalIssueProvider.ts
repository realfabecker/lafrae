import { IssuePaginateFilter } from "core/domain/jira/IssuePaginateFilter";
import { Issue as DomainIssue } from "core/domain/issues/Issue";

export interface IExternalIssueProvider {
  paginate(filter: IssuePaginateFilter): AsyncGenerator<DomainIssue>;
}
