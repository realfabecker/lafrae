import { AbstractModel } from "../common/AbstractModel";

type EmailAttachmentOpts = {
  id: string;
  name: string;
  body: string;
  contentType: string;
  contentEncoding: string;
};

export class EmailAttachment extends AbstractModel {
  constructor(opts: Partial<EmailAttachmentOpts>) {
    super(opts);
  }

  public getId(): string {
    return this.get("id");
  }

  public setId(id: string): void {
    this.set("id", id);
  }

  public getName(): string {
    return this.get("name");
  }

  public setName(name: string): void {
    this.set("name", name);
  }

  public getBody(): string {
    return this.get("body");
  }

  public setBody(body: string): void {
    this.set("body", body);
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
