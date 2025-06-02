import { AbstractModel } from "../common/AbstractModel";
import { MessageType } from "../enums/MessageType";
import { Attachment } from "./Attachment";

type EnergyBillOpts = {
  id: string;
  externalId: string;
  userId: string;
  total: number;
  createdAt: Date;
  dueDate: Date;
  days: number;
  consumption: number;
  reference: string;
  messageType: string;
};

export class EnergyBill extends AbstractModel {
  constructor(opts: Partial<EnergyBillOpts>) {
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

  public setExternalId(id: string): void {
    this.set("externalId", id);
  }

  public getTotal(): number {
    return this.get("total");
  }

  public setTotal(total: number): void {
    this.set("total", total);
  }

  public setCreatedAt(createdAt: Date) {
    this.set("createdAt", createdAt);
  }

  public getCreatedAt(): Date {
    return this.get("createdAt");
  }

  public getDueDate(): Date {
    return this.get("dueDate");
  }

  public setDueDate(dueDate: string): void {
    this.set("dueDate", dueDate);
  }

  public getDays(): number {
    return this.get("days");
  }

  public setDays(days: number): void {
    this.set("days", days);
  }

  public getConsumption(): number {
    return this.get("consumption");
  }

  public setConsumption(consumption: number): void {
    this.set("consumption", consumption);
  }

  public getReference(): string {
    return this.get("reference");
  }

  public setReference(reference: string): void {
    this.set("reference", reference);
  }

  public getUserId(): string {
    return this.get("userId");
  }

  public setUserId(userId: string): void {
    this.set("userId", userId);
  }

  public getMessageType(): MessageType {
    return this.get("messageType");
  }

  public setMessageType(messageType: MessageType): void {
    this.set("messageType", messageType);
  }

  public getAttachment(): Attachment[] {
    return this.get("attachment") || [];
  }

  public setAttachment(attachment: Attachment[]): void {
    this.set("attachment", attachment);
  }

  public addAttachment(attachment: Attachment) {
    const attachments = this.getAttachment() ?? [];
    attachments.push(attachment);
    this.setAttachment(attachments);
  }
}
