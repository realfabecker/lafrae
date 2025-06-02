import { ConsoleLogger } from "src/adapters/providers/ConsoleLogger";
import { GoogleEmailMessageProvider } from "src/adapters/providers/GoogleEmailMessageProvider";
import { RegexMessageDetailExtractor } from "src/adapters/providers/RegexMessageDetailExtractor";
import { SQSQueueProvider } from "src/adapters/providers/SQSQueueProvider";
import { EnergyBillDynamoDbRepository } from "src/database/dynamodb/repositories/EnergyBillDynamoRepository";
import { CrawlerInMemRepository } from "src/database/inmem/repositories/CrawlerInMemRepository";
import { S3ObjectStorageRepository } from "src/database/s3/repositories/S3ObjectStorageRepository";
import { ImportMessageAttachment } from "src/features/ImportMessageAttachment";
import { ImportMessageTypeDetails } from "src/features/ImportMessageTypeDetails";
import { ScheduleMessageTypeImport } from "src/features/ScheduleMessageTypeImport";

async function useCaseScheduleImport(queueUrl: string) {
  const useCase = new ScheduleMessageTypeImport({
    emailProvider: new GoogleEmailMessageProvider(),
    crawlerRepository: new CrawlerInMemRepository(),
    queueProvider: new SQSQueueProvider(queueUrl),
    logger: new ConsoleLogger(),
  });
  return useCase.run({ crawlerId: "123456" });
}

async function useCaseImportDetails(
  userId: string,
  messageId: string,
  crawlerId: string = "123456",
) {
  const useCase = new ImportMessageTypeDetails({
    emailProvider: new GoogleEmailMessageProvider(),
    crawlerRepository: new CrawlerInMemRepository(),
    detailExtractor: new RegexMessageDetailExtractor(),
    energyBillRepository: new EnergyBillDynamoDbRepository("sintese"),
  });
  return useCase.run({ userId, messageId, crawlerId });
}

async function useCaseImportAttachments(userId: string, messageId: string) {
  const useCase = new ImportMessageAttachment(
    new GoogleEmailMessageProvider(),
    new EnergyBillDynamoDbRepository("sintese"),
    new S3ObjectStorageRepository(),
    new ConsoleLogger(),
  );
  return useCase.run({ userId, messageId });
}

(async () => {
  try {
    // const result = await useCaseImportDetails(
    //   accessToken,
    //   "01972d36-00b7-7617-b9e5-f228a0545ec2",
    //   "1970cbeb69114f7a",
    // );

    // const result = await useCaseImportAttachments(
    //   accessToken,
    //   "01972d36-00b7-7617-b9e5-f228a0545ec2",
    //   "019736b1-ea1e-7119-bc8e-f70a4fe34ad7",
    // );

    const result = await useCaseScheduleImport(
      process.env.SQS_QUEUE_URL as string,
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
