import axios, { AxiosResponse } from "axios";
import { Issue as DomainIssue } from "core/domain/Issue";
import { IssueMapper } from "@adapters/mappers/IssueMapper";
import { Domain } from "domain";
import { IExternalIssueProvider } from "core/ports/IExternalIssueProvider";

type JiraIssueProviderOpts = {
  baseUrl: string;
  username: string;
  password: string;
};

export class JiraHttpIssueProvider implements IExternalIssueProvider {
  constructor(private readonly config: JiraIssueProviderOpts) {}

  async *paginate(jql: string): AsyncGenerator<DomainIssue> {
    let next = null;

    do {
      const api = axios.create({
        baseURL: this.config.baseUrl,
        auth: {
          username: this.config.username,
          password: this.config.password,
        },
      });

      const res: AxiosResponse<Record<string, any>> = await api.get<
        Record<string, any>
      >(`rest/api/3/search/jql?jql=${jql}`, {
        params: {
          nextPageToken: next,
          maxResults: 100,
          fields: "summary,status,priority,creator,assignee,created",
        },
      });

      const issues: DomainIssue[] = (res.data?.issues || []).map((i: any) =>
        IssueMapper.fromJira(i),
      );

      yield* issues;

      next = res.data.nextPageToken;
    } while (next);
  }
}
