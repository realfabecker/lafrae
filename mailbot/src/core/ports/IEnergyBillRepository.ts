import { DomainResult } from "core/domain/common/DomainResult";
import { EnergyBillInvoice } from "core/domain/invoices/EnergyBillInvoice";
import { InvoiceAttachment } from "core/domain/invoices/InvoiceAttachment";

export interface IEnergyBillRepository {
  save(energyBill: EnergyBillInvoice): Promise<DomainResult<EnergyBillInvoice>>;
  findById(id: string): Promise<DomainResult<EnergyBillInvoice>>;
  upsertAttachments(
    id: string,
    attachments: InvoiceAttachment[],
  ): Promise<DomainResult>;
}
