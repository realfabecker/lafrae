import { IIssueRepository } from "./IIssueRepository";

export interface IRepositoryProvider {
  getIssueRepository(): IIssueRepository;
  destroy(): Promise<void>;
}
