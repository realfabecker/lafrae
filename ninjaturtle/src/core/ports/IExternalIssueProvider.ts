import { Issue as DomainIssue } from "core/domain/Issue";

export interface IExternalIssueProvider {
  paginate(jql: string): AsyncGenerator<DomainIssue>;
}
