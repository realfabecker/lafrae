import { AbstractModel } from "../common/AbstractModel";
import { EmailAttachment } from "./EmailAttachment";

type EmailMessageOpts = {
  id: string;
  body: string;
  attachment?: EmailAttachment[];
};

export class EmailMessage extends AbstractModel {
  constructor(opts: Partial<EmailMessageOpts>) {
    super(opts);
  }

  public getId(): string {
    return this.get("id");
  }

  public setId(id: string): void {
    this.set("id", id);
  }

  public getBody(): string {
    return this.get("body");
  }

  public setBody(body: string): void {
    this.set("body", body);
  }

  public getAttachment(): EmailAttachment[] {
    return this.get("attachment") || [];
  }

  public setAttachment(attachment: EmailAttachment[]): void {
    this.set("attachment", attachment);
  }

  public addAttachment(attachment: EmailAttachment) {
    const attachments = this.getAttachment() ?? [];
    attachments.push(attachment);
    this.setAttachment(attachments);
  }
}
