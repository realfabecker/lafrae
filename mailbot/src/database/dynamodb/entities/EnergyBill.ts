import { AbstractModel } from "src/core/domain/common/AbstractModel";
import { MessageType } from "src/core/domain/enums/MessageType";

export type EnergyBillOpts = {
  PK: string;
  SK: string;
  ID: string;
  GSI1_PK?: string;
  GSI1_SK?: string;
  Total: number;
  CreatedAt: string;
  DueDate: string;
  Days: number;
  Consumption: string;
  Reference: string;
  ExternalId: string;
  UserId: string;
  MessageType: MessageType;
  Attachments?: Record<string, any>[];
};

export class EnergyBill extends AbstractModel {
  constructor(opts: EnergyBillOpts) {
    super(opts);
  }

  public getPK(): string {
    return this.get("PK");
  }

  public setPK(pk: string) {
    this.set("PK", pk);
  }

  public getSK(): string {
    return this.get("SK");
  }

  public setSK(sk: string) {
    this.set("SK", sk);
  }

  public getGSI1PK(): string {
    return this.get("GSI1_PK");
  }

  public setGSI1PK(gsi1_pk: string) {
    this.set("GSI1_PK", gsi1_pk);
  }

  public getGSI1SK(): string {
    return this.get("GSI1_SK");
  }

  public setGSI1SK(gsi1_sk: string) {
    this.set("GSI1_SK", gsi1_sk);
  }

  public getTotal(): number {
    return this.get("Total");
  }

  public setTotal(total: number) {
    this.set("Total", total);
  }

  public getDueDate(): string {
    return this.get("DueDate");
  }

  public setDueDate(dueDate: string) {
    this.set("DueDate", dueDate);
  }

  public getDays(): number {
    return this.get("Days");
  }

  public setDays(days: number) {
    this.set("Days", days);
  }

  public getConsumption(): number {
    return this.get("Consumption");
  }

  public setConsumption(consumption: number) {
    this.set("Consumption", consumption);
  }

  public getReference(): string {
    return this.get("Reference");
  }

  public setReference(reference: string) {
    this.set("Reference", reference);
  }

  public getID(): string {
    return this.get("ID");
  }

  public setID(id: string) {
    this.set("ID", id);
  }

  public getExternalId(): string {
    return this.get("ExternalId");
  }

  public setExternalId(externalId: string) {
    this.set("ExternalId", externalId);
  }

  public getMessageType(): MessageType {
    return this.get("MessageType");
  }

  public setMessageType(messageType: MessageType) {
    this.set("MessageType", messageType);
  }

  public getAttachments(): Record<string, any>[] {
    return this.get("attachments") ?? [];
  }

  public setAttachments(attachments: Record<string, any>[]): void {
    this.set("Attachments", attachments);
  }

  public addAttachment(attachment: Record<string, any>) {
    const attachments = this.getAttachments() ?? [];
    attachments.push(attachment);
    this.setAttachments(attachments);
  }

  public getUserId(): string {
    return this.get("UserId");
  }

  public setUserId(userId: string): void {
    this.set("UserId", userId);
  }

  public getCreatedAt(): string {
    return this.get("CreatedAt");
  }

  public setCreatedAt(createdAt: string): void {
    this.set("CreatedAt", createdAt);
  }
}
