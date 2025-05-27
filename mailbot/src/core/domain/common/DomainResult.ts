import { AbstractModel } from "./AbstractModel";
import { DomainError } from "./DomainError";

type DomainResultOpts<T, E> = {
  payload: T;
  error: E;
  success: boolean;
};

export class DomainResult<T = any, E = DomainError> extends AbstractModel {
  public constructor(opts?: Partial<DomainResultOpts<T, E>>) {
    super(opts);
  }

  public static Ok<T>(payload?: T) {
    const result = new DomainResult();
    result.setSuccess(true);
    result.setPayload(payload);
    return result;
  }

  public static Error(error: Error) {
    const result = new DomainResult();
    result.setError(new DomainError({ error: error.message }));
    result.setSuccess(false);
    return result;
  }

  public setPayload(data: T): void {
    this.set("payload", data);
  }

  public getPayload(): T {
    return this.get("payload");
  }

  public setError(error: E): void {
    this.set("error", error);
  }

  public getError(): E {
    if (!this.get("error")) {
      this.set("error", new DomainError() as E);
    }
    return this.get("error");
  }

  public setSuccess(success: boolean) {
    this.set("success", success);
  }

  public isSuccess(): boolean {
    return this.get("success");
  }
}
