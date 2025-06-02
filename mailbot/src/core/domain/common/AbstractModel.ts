import { DomainSerializer } from "./DomainSerializer";

export abstract class AbstractModel {
  protected data: Record<string, any> = {};

  constructor(props?: Record<string, any>) {
    if (props && Object.keys(props)) {
      DomainSerializer.unserialize(this, props);
    }
  }

  public getData(): Record<string, any> {
    return this.data;
  }

  public setData(data: Record<string, any>) {
    this.data = data;
  }

  public set(key: string, val: any) {
    this.data[key] = val;
  }

  public get<T = any>(key: string): T {
    return (<Record<string, T>>this.data)[key];
  }

  public serialize(): Record<string, any> {
    return DomainSerializer.serialize(this);
  }
}
