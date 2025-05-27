import path from "node:path";
import { DomainResult } from "core/domain/common/DomainResult";
import {
  IObjectStorageRepository,
  ObjectStorageUploadOpts,
} from "core/ports/IObjectStorageRepository";
import fs from "node:fs";

export class LocalObjectStorageRepository implements IObjectStorageRepository {
  async upload({
    key,
    content,
    contentEncoding,
  }: ObjectStorageUploadOpts): Promise<DomainResult<string>> {
    try {
      const filename = path.resolve(
        path.join(__dirname, "..", "..", "..", "..", "resources", key),
      );
      const d = path.dirname(filename);
      if (!fs.existsSync(d) && !fs.mkdirSync(d, { recursive: true })) {
        return DomainResult.Error(new Error("Unable to create directory"));
      }

      if (contentEncoding === "base64") {
        fs.writeFileSync(filename, Buffer.from(content, "base64"));
      } else {
        fs.writeFileSync(filename, content);
      }

      return DomainResult.Ok();
    } catch (e) {
      return DomainResult.Error(<Error>e);
    }
  }
}
