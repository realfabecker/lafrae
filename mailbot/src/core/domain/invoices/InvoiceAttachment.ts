import { AbstractModel } from "../common/AbstractModel";

type InvoiceAttachmentOpts = {
  id: string;
  name: string;
  externalId: string;
  contentType: string;
  contentEncoding: string;
};

export class InvoiceAttachment extends AbstractModel {
  constructor(opts: Partial<InvoiceAttachmentOpts>) {
    super(opts);
  }

  public getId(): string {
    return this.get("id");
  }

  public setId(id: string): void {
    this.set("id", id);
  }

  public getExternalId(): string {
    return this.get("externalId");
  }

  public setExternalId(externalId: string): void {
    this.set("externalId", externalId);
  }

  public getName(): string {
    return this.get("name");
  }

  public setName(name: string): void {
    this.set("name", name);
  }

  public getObjectUrl(): string {
    return this.get("objectUrl");
  }

  public setObjectUrl(name: string): void {
    this.set("objectUrl", name);
  }

  public getContentType(): string {
    return this.get("contentType");
  }

  public setContentType(contentType: string): void {
    this.set("contentType", contentType);
  }

  public getContentEncoding(): string {
    return this.get("contentEncoding");
  }

  public setContentEncoding(contentEncoding: string): void {
    this.set("contentEncoding", contentEncoding);
  }
}
