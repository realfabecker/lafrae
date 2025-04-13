import { IssueStatus } from "../issues/enums/IssueStatus";
import { BaseListFilter, BaseListFilterOpts } from "./BaseListFilter";

type IssueListFilterOpts = {
  status: IssueStatus;
} & BaseListFilterOpts;

export class IssueListFilter extends BaseListFilter {
  constructor(opts?: Partial<IssueListFilterOpts>) {
    super({
      ...(opts || {}),
      status: opts?.status || IssueStatus.Para_Desenvolvimento,
    });
  }

  public getStatus(): IssueStatus {
    return this.get("status");
  }

  public setStatus(status: IssueStatus) {
    this.set("status", status);
  }
}
