import { IExternalIssueProvider } from "./IExternalIssueProvider";

export interface IExternalProvider {
  getExternalIssueProvider(): IExternalIssueProvider;
}
