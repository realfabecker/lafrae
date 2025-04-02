import { IExternalProvider } from "core/ports/IExternalProvider";
import { JiraHttpIssueProvider } from "./jira/JiraHttpIssueProvider";
import { IExternalIssueProvider } from "core/ports/IExternalIssueProvider";

export class HttpExternalProvider implements IExternalProvider {
  private constructor(
    private readonly config: {
      baseUrl: string;
      password: string;
      username: string;
    },
  ) {}

  public static async init(config: {
    type: string;
    config: Record<string, any>;
  }) {
    const username = config.config.username;
    const password = config.config.password;
    const baseUrl = config.config.baseUrl;
    return new HttpExternalProvider({
      baseUrl,
      username,
      password,
    });
  }

  public getExternalIssueProvider(): IExternalIssueProvider {
    return new JiraHttpIssueProvider({
      baseUrl: this.config.baseUrl,
      password: this.config.password,
      username: this.config.username,
    });
  }
}
