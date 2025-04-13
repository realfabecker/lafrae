import { AbstractModel } from "../AbstractModel";
import { IssueProvider } from "../issues/enums/IssueProvider";
import { JiraProvider } from "./JiraProvider";

type ProviderConfigProps = {
  id: string;
  provider: IssueProvider;
  config: Record<string, any>;
};

export class Config extends AbstractModel {
  private provider: JiraProvider | undefined;

  constructor(props?: Partial<ProviderConfigProps>) {
    super(props);
  }

  public getId(): string {
    return this.get("id");
  }

  public setId(id: string) {
    this.set("id", id);
  }

  public getProvider(): IssueProvider {
    return this.get("provider");
  }

  public setProvider(provider: IssueProvider) {
    this.set("provider", provider);
  }

  public setConfig(config: Record<string, any>) {
    this.set("config", config);
  }

  public getConfig(): Record<string, any> {
    return this.get("config");
  }

  public getJiraProvider(): JiraProvider {
    if (!this.provider) {
      this.provider = new JiraProvider(this);
    }
    return this.provider;
  }
}
