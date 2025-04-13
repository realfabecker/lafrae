import axios, { AxiosResponse } from "axios";
import { Issue as DomainIssue } from "core/domain/issues/Issue";
import { IssueMapper } from "@adapters/mappers/IssueMapper";
import { IExternalIssueProvider } from "core/ports/IExternalIssueProvider";
import { IssuePaginateFilter } from "core/domain/jira/IssuePaginateFilter";
import { Issue as JiraIssue } from "core/domain/jira/Issue";

type JiraIssueProviderOpts = {
  baseUrl: string;
  username: string;
  password: string;
};

export class JiraHttpIssueProvider implements IExternalIssueProvider {
  constructor(private readonly config: JiraIssueProviderOpts) {}

  async *paginate(filter: IssuePaginateFilter): AsyncGenerator<DomainIssue> {
    let next = null;

    let jql = "assignee=currentUser()";
    if (filter.getLastIssueId()) {
      jql += ` and id > ${filter.getLastIssueId()}`;
    }
    jql += ` order by created asc`;

    do {
      const api = axios.create({
        baseURL: this.config.baseUrl,
        auth: {
          username: this.config.username,
          password: this.config.password,
        },
      });

      const res: AxiosResponse = await api.post<{
        issues: JiraIssue[];
        nextPageToken?: string;
      }>(`rest/api/3/search/jql`, {
        jql,
        fields: [
          "summary",
          "issuetype",
          "status",
          "priority",
          "creator",
          "assignee",
          "created",
          "priority",
          "customfield_10020",
          "customfield_10031",
          "customfield_10041",
        ],
        maxResults: 100,
        nextPageToken: next,
      });

      const issues: DomainIssue[] = (res.data?.issues || []).map(
        (i: JiraIssue) => IssueMapper.fromJira(i),
      );

      yield* issues;

      next = res.data.nextPageToken;
    } while (next);
  }
}
