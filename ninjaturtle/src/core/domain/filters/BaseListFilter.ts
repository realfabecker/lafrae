import { AbstractModel } from "../AbstractModel";

export type BaseListFilterOpts = {
  [x: string]: any;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
};

export class BaseListFilter extends AbstractModel {
  constructor(opts?: Partial<BaseListFilterOpts>) {
    super({
      ...(opts || {}),
      page: opts?.page || 1,
      page_size: opts?.page_size || 10,
      sort_by: opts?.sort_by || "created_at",
      sort_dir: (opts?.sort_dir || "desc").toUpperCase(),
    });
  }

  public getPage() {
    return this.get("page");
  }

  public setPage(page: number) {
    this.set("page", page);
  }

  public setPageSize(page_size: number) {
    this.set("page_size", page_size);
  }

  public getPageSize() {
    return this.get("page_size");
  }

  public getOffset() {
    return (this.getPage() - 1) * this.getPageSize();
  }

  public getSortBy() {
    return this.get("sort_by");
  }

  public setSortBy(sort_by: string) {
    this.set("sort_by", sort_by);
  }

  public setSortDir(sort_dir: string) {
    this.set("sort_dir", sort_dir);
  }

  public getSortDir(): "ASC" | "DESC" {
    return this.get("sort_dir");
  }
}
