import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DomainResult } from "core/domain/common/DomainResult";
import { UnableToUploadObject } from "core/domain/errors/UnabletToUploadObject";
import {
  IObjectStorageRepository,
  ObjectStorageUploadOpts,
} from "core/ports/IObjectStorageRepository";

export class S3ObjectStorageRepository implements IObjectStorageRepository {
  async upload({
    key,
    content,
    contentEncoding,
  }: ObjectStorageUploadOpts): Promise<DomainResult<string>> {
    try {
      const client = new S3Client({
        region: "us-east-1",
      });

      const command = new PutObjectCommand({
        Bucket: "sintese",
        Key: key,
        Body: Buffer.from(content, contentEncoding as BufferEncoding),
        ContentEncoding: contentEncoding,
      });

      const result = await client.send(command);
      if (result.$metadata.httpStatusCode !== 200) {
        return DomainResult.Error(new UnableToUploadObject());
      }

      return DomainResult.Ok();
    } catch (e) {
      return DomainResult.Error(<Error>e);
    }
  }
}
