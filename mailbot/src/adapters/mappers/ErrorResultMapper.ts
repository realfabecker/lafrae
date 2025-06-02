import { DomainError } from "src/core/domain/common/DomainError";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { GoogleError } from "src/core/domain/google/GoogleError";

export class ErrorResultMapper {
  static fromGoogle(error: GoogleError) {
    const domainResult = new DomainResult();
    const domainError = new DomainError();
    domainError.setStatusCode(error?.code);
    domainError.setError(error?.message);
    domainResult.setError(domainError);
    return domainResult;
  }
}
