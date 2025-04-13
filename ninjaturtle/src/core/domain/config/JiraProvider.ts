import { AbstractConfig } from "../AbstractConfig";
import { IssueProvider } from "../issues/enums/IssueProvider";
import { Config as DomainConfig } from "./Config";

export class JiraProvider extends AbstractConfig {
  constructor(parent: DomainConfig) {
    super(parent, IssueProvider.JIRA);
  }

  public setLastImportedIssueId(lastImportedId: number) {
    this.set("lastImportedIssueId", lastImportedId);
  }

  public getLastImportedIssueId() {
    return this.get("lastImportedIssueId");
  }
}
