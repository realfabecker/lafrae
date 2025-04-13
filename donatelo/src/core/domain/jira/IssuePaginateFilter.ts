import { AbstractModel } from "../AbstractModel";

type IssuePaginateFilterProps = {
  lastIssueId?: number | null;
};

export class IssuePaginateFilter extends AbstractModel {
  constructor(props: Partial<IssuePaginateFilterProps>) {
    super(props);
  }

  public getLastIssueId() {
    return this.get("lastIssueId");
  }

  public setLastIssueId(lastIssueId: number) {
    this.set("lastIssueId", lastIssueId);
  }
}
