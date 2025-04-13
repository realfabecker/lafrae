import { AbstractModel } from "./AbstractModel";

export abstract class AbstractConfig extends AbstractModel {
  constructor(
    protected parent: AbstractModel,
    protected config?: string,
  ) {
    super();
  }

  public get(key: string): any | undefined {
    const config = this.getConfig() || {};
    return config[key] ?? undefined;
  }

  public set(key: string, value: any): void {
    const config = this.getConfig() || {};
    if (value === null) {
      delete config[key];
    } else {
      config[key] = value;
    }
    this.setConfig(config);
  }

  public getConfig(): Record<string, any> | null {
    const config = this.parent.get("config") || {};
    if (this.config) {
      return config[this.config] || null;
    }
    return config || null;
  }

  public setConfig(config: Record<string, any>): void {
    const baseConfig = this.parent.get("config") || {};
    if (this.config) {
      baseConfig[this.config] = config;
      this.parent.set("config", baseConfig);
    } else {
      this.parent.set("config", config);
    }
  }
}
