import { DomainResult } from "src/core/domain/common/DomainResult";
import { ListEnergyBillFilter } from "src/core/domain/filters/ListEnergyBillFilter";
import { Attachment } from "src/core/domain/invoices/Attachment";
import { EnergyBill } from "src/core/domain/invoices/EnergyBill";
import { Page } from "src/core/domain/paged/Page";
import { IEnergyBillRepository } from "src/core/ports/IEnergyBillRepository";

export class EnergyBillInMemRepository implements IEnergyBillRepository {
  async save(energyBill: EnergyBill): Promise<DomainResult<EnergyBill>> {
    return DomainResult.Ok(energyBill);
  }

  async list(
    filter: ListEnergyBillFilter,
  ): Promise<DomainResult<Page<EnergyBill>>> {
    return DomainResult.Ok([]);
  }

  async findById(id: string): Promise<DomainResult<EnergyBill>> {
    const energyBill = new EnergyBill({
      userId: "0197286e-fdb7-7fb6-b42b-b87a34378a70",
      externalId: "1970cbeb69114f7a",
      total: 0,
      dueDate: new Date("2025-06-15"),
      createdAt: new Date(),
      days: 29,
      consumption: 240,
      reference: "05/2025",
    });
    const attachment = new Attachment({
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
    attachments: Attachment[],
  ): Promise<DomainResult> {
    return DomainResult.Ok();
  }
}
