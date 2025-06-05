import { AbstractModel } from "../common/AbstractModel";

type PageOpts<T> = {
  items: T[];
  pageToken?: string;
};

export class Page<T = Record<string, any>> extends AbstractModel {
  private constructor(opts: PageOpts<T>) {
    super(opts);
  }

  public static fromList<T = Record<string, any>>(opts: PageOpts<T>) {
    return new Page({
      items: opts.items,
      pageToken: opts.pageToken,
    });
  }

  public getItems(): T[] {
    return this.get("items");
  }

  public setItems(items: T[]): void {
    this.set("items", items);
  }

  public getPageToken(): string {
    return this.get("pageToken");
  }

  public setPageToken(page: string): void {
    this.set("pageToken", page);
  }
}
