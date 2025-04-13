import { AbstractModel } from "../AbstractModel";

type PageOpts<T> = {
  total: number;
  items: T[];
  page: number;
  page_size: number;
  total_pages: number;
  has_more: boolean;
};

export class Page<T = Record<string, any>> extends AbstractModel {
  private constructor(opts: PageOpts<T>) {
    super(opts);
  }

  public static fromList<T = Record<string, any>>(
    opts: Pick<PageOpts<T>, "items" | "page" | "page_size" | "total">,
  ) {
    return new Page({
      total: opts.total,
      items: opts.items,
      page: opts.page,
      page_size: opts.page_size,
      total_pages: Math.ceil(opts.total / opts.page_size),
      has_more: opts.page < Math.ceil(opts.total / opts.page_size),
    });
  }

  public getTotal(): number {
    return this.get("total");
  }

  public setTotal(total: number): void {
    this.set("total", total);
  }

  public getItems(): T[] {
    return this.get("items");
  }

  public setItems(items: T[]): void {
    this.set("items", items);
  }

  public getPage(): number {
    return this.get("page");
  }

  public setPage(page: number): void {
    this.set("page", page);
  }

  public getPageSize(): number {
    return this.get("page_size");
  }

  public setPageSize(page_size: number): void {
    this.set("page_size", page_size);
  }

  public getTotalPages(): number {
    return this.get("total_pages");
  }

  public setTotalPages(total_pages: number): void {
    this.set("total_pages", total_pages);
  }

  public getHasMore(): boolean {
    return this.get("has_more");
  }

  public setHasMore(has_more: boolean): void {
    this.set("has_more", has_more);
  }
}
