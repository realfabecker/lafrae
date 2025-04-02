import { Issue as DomainIssue } from "core/domain/Issue";
import { Issue as IssueEntity } from "database/entities/Issue";
import { IssueProvider } from "core/enum/IssueProvider";

export class IssueMapper {
  public static fromJira(jira_issue: Record<string, any>): DomainIssue {
    return new DomainIssue({
      assignee: jira_issue?.fields?.assignee?.emailAddress,
      externalId: jira_issue.id,
      title: jira_issue?.fields?.summary,
      createdAt: new Date(jira_issue?.fields.created),
      link: `https://zorders.atlassian.net/browse/${jira_issue.key}`,
      provider: IssueProvider.JIRA,
      status: jira_issue.fields.status.name,
      config: jira_issue,
    });
  }

  public static toPersistence(issue: DomainIssue): IssueEntity {
    const issueEntity = new IssueEntity();
    issueEntity.external_id = issue.getExternalId();
    issueEntity.provider = issue.getProvider();
    issueEntity.title = issue.getTitle();
    issueEntity.assignee = issue.getAssignee();
    issueEntity.status = issue.getStatus();
    issueEntity.created_at = issue.getCreatedAt();
    issueEntity.link = issue.getLink();
    issueEntity.config = issue.getConfig();
    return issueEntity;
  }
}
