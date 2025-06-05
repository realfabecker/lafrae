import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { UnableToUploadObject } from "src/core/domain/errors/UnabletToUploadObject";
import {
  IObjectStorageRepository,
  ObjectStorageUploadOpts,
} from "src/core/ports/IObjectStorageRepository";

export class S3ObjectStorageRepository implements IObjectStorageRepository {
  async upload({
    key,
    content,
    contentEncoding,
  }: ObjectStorageUploadOpts): Promise<DomainResult<string>> {
    try {
      let config: S3ClientConfig = {
        region: process.env.AWS_DEFAULT_REGION ?? "us-east-1",
      };
      if (process.env.AWS_ENDPOINT) {
        config = {
          ...config,
          endpoint: process.env.AWS_ENDPOINT,
          forcePathStyle: true,
        };
      }
      const client = new S3Client(config);
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
      return DomainResult.Ok(key);
    } catch (e) {
      return DomainResult.Error(<Error>e);
    }
  }
}
