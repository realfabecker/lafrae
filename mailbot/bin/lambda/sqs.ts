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
import { SqsAsEventSourceHandler } from "src/handlers/lambda/SqsAsEventSourceHandler";

const source = new SqsAsEventSourceHandler(
  new ConsoleLogger(),
  new ScheduleMessageTypeImport({
    emailProvider: new GoogleEmailMessageProvider(),
    crawlerRepository: new CrawlerInMemRepository(),
    queueProvider: new SQSQueueProvider(process.env.SQS_QUEUE_URL as string),
    logger: new ConsoleLogger(),
  }),
  new ImportMessageTypeDetails({
    emailProvider: new GoogleEmailMessageProvider(),
    crawlerRepository: new CrawlerInMemRepository(),
    detailExtractor: new RegexMessageDetailExtractor(),
    energyBillRepository: new EnergyBillDynamoDbRepository("sintese"),
  }),
  new ImportMessageAttachment(
    new GoogleEmailMessageProvider(),
    new EnergyBillDynamoDbRepository("sintese"),
    new S3ObjectStorageRepository(),
    new ConsoleLogger(),
  ),
);

export const handler = async (event: Record<string, any>) => {
  try {
    await source.handler(event);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Operation completed" }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: (<Error>e).message }),
    };
  }
};
