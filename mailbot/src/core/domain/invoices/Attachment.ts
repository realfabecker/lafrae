import { AbstractModel } from "../common/AbstractModel";
import { AttachmentObjectStorageKey } from "../fields/AttachmentObjectStorageKey";
import { parseISO } from "date-fns";

type AttachmentOpts = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  externalId: string;
  contentType: string;
  contentEncoding: string;
};

export class Attachment extends AbstractModel {
  constructor(opts: Partial<AttachmentOpts>) {
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
    if (!this.get("objectUrl")) {
      const objectKey = AttachmentObjectStorageKey.new({
        attachment: this,
      }).getValue();
      this.setObjectUrl(objectKey);
    }
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

  public getUserId(): string {
    return this.get("userId");
  }

  public setUserId(userId: string): void {
    this.set("userId", userId);
  }

  public getCreatedAt(): Date {
    return parseISO(this.get("createdAt"));
  }

  public setCreatedAt(createdAt: Date | string): void {
    if (createdAt instanceof Date) {
      this.set("createdAt", createdAt.toISOString());
    } else {
      this.set("createdAt", createdAt);
    }
  }
}
