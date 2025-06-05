import { ConsoleLogger } from "src/adapters/providers/ConsoleLogger";
import { GoogleEmailMessageProvider } from "src/adapters/providers/GoogleEmailMessageProvider";
import { RegexMessageDetailExtractor } from "src/adapters/providers/RegexMessageDetailExtractor";
import { SQSQueueProvider } from "src/adapters/providers/SQSQueueProvider";
import { EnergyBillDynamoDbRepository } from "src/database/dynamodb/repositories/EnergyBillDynamoRepository";
import { S3ObjectStorageRepository } from "src/database/s3/repositories/S3ObjectStorageRepository";
import { ImportMessageAttachment } from "src/features/ImportMessageAttachment";
import { ImportMessageTypeDetails } from "src/features/ImportMessageTypeDetails";
import { ScheduleMessageTypeImport } from "src/features/ScheduleMessageTypeImport";
import { SqsAsEventSourceHandler } from "src/handlers/lambda/SqsAsEventSourceHandler";
import { SQSEvent } from "aws-lambda";
import { MessageCrawlerConfigInMemRepository } from "src/database/inmem/repositories/MessageCrawlerConfigInMemRepository";
import { GoogleOpenIdProvider } from "src/adapters/providers/GoogleOpenIdProvider";
import { OpenIdAuthDynamoRepository } from "src/database/dynamodb/repositories/OpenIdAuthDynamoRepository";
import { JwtProvider } from "src/adapters/providers/JwtProvider";

const logger = new ConsoleLogger();
const jwtProvider = new JwtProvider(process.env.JWT_KEY as string);
const source = new SqsAsEventSourceHandler(
  logger,
  new ScheduleMessageTypeImport({
    openIdProvider: new GoogleOpenIdProvider(
      new OpenIdAuthDynamoRepository("sintese"),
      logger,
    ),
    emailProvider: new GoogleEmailMessageProvider(),
    crawlerRepository: new MessageCrawlerConfigInMemRepository(),
    queueProvider: new SQSQueueProvider(process.env.SQS_QUEUE_URL as string),
    logger,
  }),
  new ImportMessageTypeDetails({
    openIdProvider: new GoogleOpenIdProvider(
      new OpenIdAuthDynamoRepository("sintese"),
      logger,
    ),
    emailProvider: new GoogleEmailMessageProvider(),
    crawlerRepository: new MessageCrawlerConfigInMemRepository(),
    detailExtractor: new RegexMessageDetailExtractor(),
    energyBillRepository: new EnergyBillDynamoDbRepository(
      "sintese",
      jwtProvider,
    ),
    queueProvider: new SQSQueueProvider(process.env.SQS_QUEUE_URL as string),
    logger,
  }),
  new ImportMessageAttachment({
    openIdProvider: new GoogleOpenIdProvider(
      new OpenIdAuthDynamoRepository("sintese"),
      logger,
    ),
    crawlerRepository: new MessageCrawlerConfigInMemRepository(),
    emailProvider: new GoogleEmailMessageProvider(),
    energyBillRepository: new EnergyBillDynamoDbRepository(
      "sintese",
      jwtProvider,
    ),
    objectStorageRepository: new S3ObjectStorageRepository(),
    logger,
  }),
);

export const handler = async (event: SQSEvent) => {
  try {
    const result = await source.handler(event);
    if (!result.isSuccess()) {
      logger.error(result.getError().getErrorDescription());
    }
    if (Array.isArray(result.getPayload()) && result.getPayload().length) {
      return { batchItemFailures: result.getPayload() };
    }
  } catch (e) {
    logger.error((<Error>e).message);
  }
};
