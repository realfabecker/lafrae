import { IssueProvider } from "core/enum/IssueProvider";
import { AbstractModel } from "./AbstractModel";

type IssueProps = {
  title: string;
  assignee: string;
  status: string;
  provider: IssueProvider;
  createdAt: Date;
  link: string;
  config: Record<string, any>;
  externalId: string;
};

export class Issue extends AbstractModel {
  constructor(props: Partial<IssueProps>) {
    super(props);
  }

  public getId(): string {
    return this.get("id");
  }

  public setId(id: string) {
    this.set("id", id);
  }

  public getExternalId() {
    return this.get("externalId");
  }

  public setExternalId(externalId: string) {
    this.set("externalId", externalId);
  }

  public getTitle(): string {
    return this.get("title");
  }

  public setTitle(title: string) {
    this.set("title", title);
  }

  public setAssignee(assignee: string) {
    this.set("assignee", assignee);
  }

  public getAssignee(): string {
    return this.get("assignee");
  }

  public getStatus() {
    return this.get("status");
  }

  public setStatus(status: string) {
    this.set("status", status);
  }

  public getProvider(): IssueProvider {
    return this.get("provider");
  }

  public setProvider(provider: IssueProvider) {
    this.set("provider", provider);
  }

  public getCreatedAt(): Date {
    return this.get("createdAt");
  }

  public setCreatedAt(createdAt: Date) {
    this.set("createdAt", createdAt);
  }

  public getLink(): string {
    return this.get("link");
  }

  public setLink(link: string) {
    this.set("link", link);
  }

  public getConfig(): Record<string, any> {
    return this.get("config");
  }

  public setConfig(config: Record<string, any>) {
    this.set("config", config);
  }
}
