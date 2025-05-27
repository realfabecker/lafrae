import { AbstractModel } from "../common/AbstractModel";

type EmailListFilterOpts = {
  label: string;
  isUnread: boolean;
};

export class EmailListFilter extends AbstractModel {
  constructor(opts?: Partial<EmailListFilterOpts>) {
    super(opts);
  }

  public getLabel(): string {
    return this.get("label");
  }

  public setLabel(label: string): void {
    this.set("label", label);
  }

  public getIsUnread(): boolean {
    return this.get("isUnread");
  }

  public setIsUnread(isUnread: boolean): void {
    this.set("isUnread", isUnread);
  }
}
