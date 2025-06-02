import { DomainResult } from "src/core/domain/common/DomainResult";

export interface IQueueProvider {
  publish(message: Record<string, any>): Promise<DomainResult<void>>;
}
