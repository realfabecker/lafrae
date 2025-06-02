import path from "node:path";
import { Attachment } from "../invoices/Attachment";

export class AttachmentObjectStorageKey {
  private constructor(private readonly value: string) {}

  public static new({ attachment }: { attachment: Attachment }) {
    const key = [
      "attachments",
      attachment.getUserId(),
      attachment.getCreatedAt().getFullYear(),
      attachment.getCreatedAt().getMonth(),
      `${attachment.getId()}${path.extname(attachment.getName())}`,
    ];
    return new AttachmentObjectStorageKey(key.join("/"));
  }

  public getValue(): string {
    return this.value;
  }
}
