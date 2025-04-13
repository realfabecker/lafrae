import { Issue as DomainIssue } from "core/domain/issues/Issue";
import { Issue as IssueEntity } from "database/entities/Issue";
import { IssueProvider } from "core/domain/issues/enums/IssueProvider";
import { Issue as JiraIssue } from "core/domain/jira/Issue";
import { IssueStatus } from "core/domain/issues/enums/IssueStatus";

export class IssueMapper {
  public static fromJira(jira_issue: JiraIssue): DomainIssue {
    return new DomainIssue({
      assignee: jira_issue?.fields?.assignee?.emailAddress,
      externalId: jira_issue.id,
      title: jira_issue?.fields?.summary,
      createdAt: new Date(jira_issue?.fields.created),
      link: `https://zorders.atlassian.net/browse/${jira_issue.key}`,
      provider: IssueProvider.JIRA,
      status: jira_issue.fields.status.name?.toLowerCase() as IssueStatus,
      config: jira_issue,
      issueType: jira_issue.fields.issuetype.name?.toLowerCase(),
      priority: jira_issue.fields.priority?.name,
      storyPoints: jira_issue.fields?.customfield_10031,
      team: jira_issue.fields.customfield_10041?.value?.toLowerCase(),
      sprint: jira_issue.fields.customfield_10020?.[0]?.name?.toLowerCase(),
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
    issueEntity.issueType = issue.getIssueType();
    issueEntity.priority = issue.getPriority();
    issueEntity.team = issue.getTeam();
    issueEntity.sprint = issue.getSprint();
    issueEntity.config = issue.getConfig();
    issueEntity.storyPoints = issue.getStoryPoints();
    return issueEntity;
  }

  public static toDomain(issue: IssueEntity): DomainIssue {
    return new DomainIssue({
      id: issue.id,
      assignee: issue.assignee,
      createdAt: issue.created_at,
      link: issue.link,
      title: issue.title,
      provider: issue.provider,
      config: issue.config,
      externalId: issue.external_id,
      status: issue.status,
    });
  }
}
