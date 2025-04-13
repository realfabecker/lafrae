import { IssueListFilter } from "core/domain/filters/IssueListFilters";
import { Issue as DomainIssue } from "core/domain/issues/Issue";

export interface IIssueRepository {
  save(issue: DomainIssue): Promise<DomainIssue>;
  create(issue: DomainIssue): Promise<DomainIssue>;
  update(issue: DomainIssue): Promise<DomainIssue>;
  count(filter: IssueListFilter): Promise<number>;
  list(filter: IssueListFilter): Promise<DomainIssue[]>;
  findByExternalId(externalId: string): Promise<DomainIssue | null>;
}
