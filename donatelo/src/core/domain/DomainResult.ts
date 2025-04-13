import { AbstractModel } from "./AbstractModel";
import { DomainError } from "./DomainError";

type ActionResultOpts<T, E> = {
  payload: T;
  error: E;
  success: boolean;
};

export class DomainResult<T = any, E = DomainError> extends AbstractModel {
  private constructor(opts?: Partial<ActionResultOpts<T, E>>) {
    super(opts);
  }

  public static OK<T>(payload?: T) {
    return new DomainResult({ success: true, payload });
  }

  public static Error(error: Error) {
    return new DomainResult({
      success: false,
      error: new DomainError({ error: error.message }),
    });
  }

  public setPayload(data: T): void {
    this.set("payload", data);
  }

  public getPayload(): T | undefined {
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

  public isSuccess(): boolean {
    return this.get("success");
  }
}
