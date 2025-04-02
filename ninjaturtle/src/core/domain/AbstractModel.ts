export abstract class AbstractModel {
  protected data: Record<string, any> = {};

  constructor(props?: Record<string, any>) {
    if (props && Object.keys(props)) {
      this.unserialize(props);
    }
  }

  public getData(): Record<string, any> {
    return this.data;
  }

  public setData(data: Record<string, any>) {
    this.data = data;
  }

  protected set(key: string, val: any) {
    this.data[key] = val;
  }

  protected get<T = any>(key: string): T {
    return (<Record<string, T>>this.data)[key];
  }

  public serialize(): Record<string, any> {
    const data: Record<string, any> = {};
    for (const [key, value] of Object.entries(this.getData())) {
      if (value instanceof AbstractModel) {
        data[key] = value.serialize();
      } else {
        data[key] = value;
      }
    }
    return data;
  }

  public unserialize(data: Record<string, any>): this {
    for (const key in data) {
      const setterName =
        "set" +
        key
          .split("_")
          .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
          .join("");

      const setterValue =
        data[key] instanceof AbstractModel ? data[key].serialize() : data[key];
      if (typeof (this as any)[setterName] === "function") {
        (this as any)[setterName](setterValue);
      }
    }
    return this;
  }
}
