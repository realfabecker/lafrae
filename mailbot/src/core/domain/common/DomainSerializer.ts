import { AbstractModel } from "./AbstractModel";

export class DomainSerializer {
  public static serialize(
    r: Record<string, any> | AbstractModel,
  ): Record<string, any> {
    const data: Record<string, any> = {};
    const props = r instanceof AbstractModel ? r.getData() : r;
    for (const [key, value] of Object.entries(props)) {
      if (value instanceof AbstractModel) {
        data[key] = this.serialize(value);
      } else if (Array.isArray(value)) {
        data[key] = value.map((r) => this.serialize(r));
      } else {
        data[key] = value;
      }
    }
    return data;
  }

  public static unserialize<T = AbstractModel>(
    model: T,
    data: Record<string, any>,
  ): T {
    for (const key in data) {
      const setterName =
        "set" +
        key
          .split("_")
          .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
          .join("");

      const setterValue =
        data[key] instanceof AbstractModel
          ? this.serialize(data[key])
          : data[key];

      if (typeof (model as any)[setterName] === "function") {
        (model as any)[setterName](setterValue);
      }
    }
    return model;
  }
}
