import crypto from "node:crypto";
import { DomainResult } from "core/domain/common/DomainResult";
import { EnergyBillInvoice } from "core/domain/invoices/EnergyBillInvoice";
import { InvoiceAttachment } from "core/domain/invoices/InvoiceAttachment";
import { IEnergyBillRepository } from "core/ports/IEnergyBillRepository";

export class EnergyBillDynamoDbRepository implements IEnergyBillRepository {
  async save(
    energyBill: EnergyBillInvoice,
  ): Promise<DomainResult<EnergyBillInvoice>> {
    return DomainResult.Ok(energyBill);
  }

  async findById(id: string): Promise<DomainResult<EnergyBillInvoice>> {
    const energyBill = new EnergyBillInvoice({
      userId: crypto.randomUUID(),
      externalId: "1970cbeb69114f7a",
      total: 0,
      dueDate: new Date("2025-06-15"),
      createdAt: new Date(),
      days: 29,
      consumption: 240,
      reference: "05/2025",
    });
    const attachment = new InvoiceAttachment({
      name: "449000201062.pdf",
      externalId:
        "ANGjdJ9x7K8BgS6zkQLIsMRoJGq-cv1-B2zsX-UfvRw5VdVIG3cNaLjKmtHidMdkq0YHDPMb-fOr8glw8UVAHhCVORMguke4rIvJJFs31xyQndifCmjS5O-jy-WuT2Stw5hPSrZChZjVnALkhR8-A8DjEvLqOzLmS2BXfHp3K-YwaGOlGbl5IadenYJx-N4eLnt9a1mZRBLvXmuPnDzUchfOjkBWSw_ZVmGoGnoyISuXA6H3jbzYf8JEYzs3cP3gIapX4iAj5cjUMSjczdBiS2SR_UKv3usYHfwFIM1spWOYATA2MT_N6lMgSr0dVfEIbIEZXpux5c18fbWJgAGxHTwbmo6IXwJqNlTEkmyeYfmwU8zEjSxn9kxnzghNe1wgVxpCvljar5mIpuOlLn2D",
      contentEncoding: "base64",
      contentType: "application/pdf",
    });
    energyBill.addAttachment(attachment);
    return DomainResult.Ok(energyBill);
  }

  async upsertAttachments(
    id: string,
    attachments: InvoiceAttachment[],
  ): Promise<DomainResult> {
    return DomainResult.Ok();
  }
}
