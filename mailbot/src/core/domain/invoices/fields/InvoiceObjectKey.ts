import crypto from "node:crypto";
import path from "node:path";
import { EnergyBillInvoice } from "../EnergyBillInvoice";
import { InvoiceAttachment } from "../InvoiceAttachment";

export class InvoiceObjectKey {
  private constructor(private readonly value: string) {}

  public static fromEnergyBill(
    energyBill: EnergyBillInvoice,
    attachment: InvoiceAttachment,
  ) {
    const key = [
      "invoices",
      energyBill.getUserId(),
      energyBill.getCreatedAt().getFullYear(),
      energyBill.getCreatedAt().getMonth(),
      `${crypto.randomUUID()}${path.extname(attachment.getName())}`,
    ];
    return new InvoiceObjectKey(key.join("/"));
  }

  public getValue(): string {
    return this.value;
  }
}
