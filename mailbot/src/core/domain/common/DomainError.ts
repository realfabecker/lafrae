import { AbstractModel } from "./AbstractModel";

type ErrorProps = {
  error: string;
  description: string;
  statusCode: number;
  details: any;
};

export class DomainError extends AbstractModel {
  constructor(opts?: Partial<ErrorProps>) {
    super(opts);
  }

  public getError(): string {
    return this.get("error");
  }

  public setError(error: string): void {
    this.set("error", error);
  }

  public getDescription(): string {
    return this.get("description");
  }

  public setDescription(description: string): void {
    this.set("description", description);
  }

  public getStatusCode(): number {
    return this.get("statusCode");
  }

  public setStatusCode(statusCode: number): void {
    this.set("statusCode", statusCode);
  }

  public setDetails(details: any) {
    this.set("details", details);
  }

  public getDetails(): any {
    return this.get("details");
  }

  public getErrorDescription(): string {
    if (!this.getError() && !this.getDescription()) {
      return "Erro desconhecido";
    }
    if (this.getDetails() === "object") {
      return `${this.getError()}: ${this.getDescription()} : ${JSON.stringify(this.getDetails())}`;
    }
    if (this.getDescription()) {
      return `${this.getError()}: ${this.getDescription()}`;
    }
    return this.getError();
  }
}
