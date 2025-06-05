import { SQSBatchItemFailure, SQSEvent } from "aws-lambda";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { OperationType } from "src/core/domain/enums/OperationType";
import {
  ImportMessageAttachmentMessage,
  ImportMessageTypeDetailsMessage,
  MessageMeta,
  ScheduleMessageTypeImportMessage,
} from "src/core/domain/schemas/ImportMessage";
import { ILogger } from "src/core/ports/ILogger";
import { ImportMessageAttachment } from "src/features/ImportMessageAttachment";
import { ImportMessageTypeDetails } from "src/features/ImportMessageTypeDetails";
import { ScheduleMessageTypeImport } from "src/features/ScheduleMessageTypeImport";
import { ZodError } from "zod";

export class SqsAsEventSourceHandler {
  constructor(
    private readonly logger: ILogger,
    private readonly scheduleMessageTypeImport: ScheduleMessageTypeImport,
    private readonly importMessageTypeDetails: ImportMessageTypeDetails,
    private readonly importMessageAttachments: ImportMessageAttachment,
  ) {}

  public async handler(
    event: SQSEvent,
  ): Promise<DomainResult<SQSBatchItemFailure[]>> {
    try {
      const sqsBatchItemFailure: SQSBatchItemFailure[] = [];

      const messages = (event.Records ?? []).map((record) => {
        return {
          messageId: record.messageId,
          data: MessageMeta.parse(JSON.parse(record.body)),
        };
      });

      for (const message of messages) {
        const result = await this.run(message.data);
        if (!result.isSuccess()) {
          sqsBatchItemFailure.push({ itemIdentifier: message.messageId });
          this.logger.error(result.getError().getErrorDescription());
        }
      }

      return DomainResult.Ok(sqsBatchItemFailure);
    } catch (e) {
      if (e instanceof ZodError) {
        const m = e.errors.map((x) => x.message).join(";");
        return DomainResult.Error(new Error(m));
      }
      return DomainResult.Error(new Error((<Error>e).message));
    }
  }

  private async run(message: MessageMeta): Promise<DomainResult> {
    switch (message?.meta?.operation) {
      case OperationType.ScheduleMessageImport: {
        this.logger.info(`schedule import: ${JSON.stringify(message)}`);
        const msg = ScheduleMessageTypeImportMessage.parse(message);
        return this.scheduleMessageTypeImport.run(msg.data);
      }
      case OperationType.ImportMessageDetails: {
        this.logger.info(`importing message: ${JSON.stringify(message)}`);
        const msg = ImportMessageTypeDetailsMessage.parse(message);
        return this.importMessageTypeDetails.run(msg.data);
      }
      case OperationType.ImportMessageAttachments: {
        this.logger.info(`importing attachments: ${JSON.stringify(message)}`);
        const msg = ImportMessageAttachmentMessage.parse(message);
        return this.importMessageAttachments.run(msg.data);
      }
    }
    return DomainResult.Error(new Error("unrecognized operation"));
  }
}
