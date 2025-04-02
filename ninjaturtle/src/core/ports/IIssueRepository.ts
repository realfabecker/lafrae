import { Issue } from "core/domain/Issue";

export interface IIssueRepository {
  create(issue: Issue): Promise<Issue>;
}
