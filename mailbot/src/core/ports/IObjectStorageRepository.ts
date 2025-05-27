import { DomainResult } from "core/domain/common/DomainResult";

export type ObjectStorageUploadOpts = {
  key: string;
  content: string;
  contentEncoding: string;
  contentType: string;
};

export interface IObjectStorageRepository {
  upload(opts: ObjectStorageUploadOpts): Promise<DomainResult<string>>;
}
