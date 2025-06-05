import { AbstractModel } from "../common/AbstractModel";

type ListEnergyBillOpts = {
  userId: string;
  pageToken?: string;
  limit?: number;
};

export class ListEnergyBillFilter extends AbstractModel {
  constructor(opts: ListEnergyBillOpts) {
    super(opts);
  }

  public getUserId(): string {
    return this.get("userId");
  }

  public setUserId(id: string): void {
    this.set("userId", id);
  }

  public getPageToken(): string {
    return this.get("pageToken");
  }

  public setPageToken(pageToken: string): void {
    this.set("pageToken", pageToken);
  }

  public getLimit(): number {
    return this.get("limit") ?? 10;
  }

  public setLimit(limit: number): void {
    this.set("limit", limit);
  }
}
