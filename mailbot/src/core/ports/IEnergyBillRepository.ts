import { DomainResult } from "src/core/domain/common/DomainResult";
import { EnergyBill } from "src/core/domain/invoices/EnergyBill";
import { ListEnergyBillFilter } from "../domain/filters/ListEnergyBillFilter";
import { Page } from "../domain/paged/Page";

export interface IEnergyBillRepository {
  save(energyBill: EnergyBill): Promise<DomainResult<EnergyBill>>;
  findById(
    userId: string,
    id: string,
  ): Promise<DomainResult<EnergyBill | null>>;
  list(filter: ListEnergyBillFilter): Promise<DomainResult<Page<EnergyBill>>>;
}
