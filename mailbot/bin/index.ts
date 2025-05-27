import { GoogleEmailMessageProvider } from "adapters/providers/GoogleEmailMessageProvider";
import { RegexMessageDetailExtractor } from "adapters/providers/RegexMessageDetailExtractor";
import { EnergyBillDynamoDbRepository } from "database/dynamodb/repositories/EnergyBillDynamoRepository";

import { CrawlerInMemRepository } from "database/inmem/repositories/CrawlerInMemRepository";
import { LocalObjectStorageRepository } from "database/s3/repositories/LocalObjectStorageRepository";
import { S3ObjectStorageRepository } from "database/s3/repositories/S3ObjectStorageRepository";
import { ImportEnergyBillAttachments } from "features/ImportEnergyBillAttachments";
import { ImportEnergyBillDetails } from "features/ImportEnergyBillDetails";
import { ScheduleEnergyBillsImport } from "features/ScheduleEnergyBillsImport";

async function useCaseScheduleImport(accessToken: string) {
  const useCase = new ScheduleEnergyBillsImport({
    emailProvider: new GoogleEmailMessageProvider(accessToken),
    crawlerRepository: new CrawlerInMemRepository(),
  });
  return useCase.run("123456");
}

async function useCaseImportDetails(
  accessToken: string,
  messageId: string,
  crawlerId: "123456",
) {
  const useCase = new ImportEnergyBillDetails({
    emailProvider: new GoogleEmailMessageProvider(accessToken),
    crawlerRepository: new CrawlerInMemRepository(),
    detailExtractor: new RegexMessageDetailExtractor(),
    energyBillRepository: new EnergyBillDynamoDbRepository(),
  });
  return useCase.run(messageId, crawlerId);
}

async function useCaseImportAttachments(
  accessToken: string,
  messageId: string,
) {
  const useCase = new ImportEnergyBillAttachments(
    new GoogleEmailMessageProvider(accessToken),
    new EnergyBillDynamoDbRepository(),
    new S3ObjectStorageRepository(),
  );
  return useCase.run(messageId);
}

(async () => {
  try {
    const accessToken = "";

    const result = await useCaseImportAttachments(
      accessToken,
      "1970cbeb69114f7a",
    );
    if (!result.isSuccess()) {
      console.log(result.getError().getErrorDescription());
      process.exit(1);
    }
    console.log("Done!");
  } catch (e) {
    console.log(e);
  }
})();
