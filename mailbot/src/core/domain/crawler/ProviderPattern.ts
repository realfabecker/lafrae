import { AbstractModel } from "../common/AbstractModel";

type ProviderPatternOpts = {
  pattern: string;
  property: string;
};

export class ProviderPattern extends AbstractModel {
  constructor(opts: Partial<ProviderPatternOpts>) {
    super(opts);
  }

  public getPattern(): string {
    return this.get("pattern");
  }

  public setPattern(pattern: string): void {
    this.set("pattern", pattern);
  }

  public getProperty(): string {
    return this.get("property");
  }

  public setProperty(property: string): void {
    this.set("property", property);
  }
}
