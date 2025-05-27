import { AbstractModel } from "../common/AbstractModel";
import { InvoiceAttachment } from "./InvoiceAttachment";

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

export class EnergyBillInvoice extends AbstractModel {
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
    this.set("total", (total + "").replace(",", "."));
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
    this.set("consumption", (consumption + "").replace(/\D/g, ""));
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

  public getMessageType(): string {
    return this.get("messageType");
  }

  public setMessageType(messageType: string): void {
    this.set("messageType", messageType);
  }

  public getAttachment(): InvoiceAttachment[] {
    return this.get("attachment") || [];
  }

  public setAttachment(attachment: InvoiceAttachment[]): void {
    this.set("attachment", attachment);
  }

  public addAttachment(attachment: InvoiceAttachment) {
    const attachments = this.getAttachment() ?? [];
    attachments.push(attachment);
    this.setAttachment(attachments);
  }
}
