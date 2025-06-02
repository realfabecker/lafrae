import { DomainResult } from "src/core/domain/common/DomainResult";
import { Attachment } from "src/core/domain/invoices/Attachment";
import { EnergyBill } from "src/core/domain/invoices/EnergyBill";

export interface IEnergyBillRepository {
  save(energyBill: EnergyBill): Promise<DomainResult<EnergyBill>>;
  findById(
    userId: string,
    id: string,
  ): Promise<DomainResult<EnergyBill | null>>;
  upsertAttachments(
    id: string,
    attachments: Attachment[],
  ): Promise<DomainResult>;
}
