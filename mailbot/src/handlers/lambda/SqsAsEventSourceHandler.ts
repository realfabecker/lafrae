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

export class SqsAsEventSourceHandler {
  constructor(
    private readonly logger: ILogger,
    private readonly scheduleMessageTypeImport: ScheduleMessageTypeImport,
    private readonly importMessageTypeDetails: ImportMessageTypeDetails,
    private readonly importMessageAttachments: ImportMessageAttachment,
  ) {}

  public async handler(event: Record<string, any>): Promise<DomainResult> {
    const messages = (event.Records ?? []).map(
      (record: Record<string, any>) => record.body,
    ) as MessageMeta[];
    for (const message of messages) {
      const result = await this.run(message);
      if (!result.isSuccess()) {
        continue;
      }
      this.logger.error(result.getError().getErrorDescription());
    }
    return DomainResult.Ok();
  }

  private async run(message: MessageMeta): Promise<DomainResult> {
    switch (message.meta.operation) {
      case OperationType.ScheduleMessageImport:
        return this.scheduleMessageTypeImport.run(
          (message as ScheduleMessageTypeImportMessage).data,
        );
      case OperationType.ImportMessageAttachments:
        return this.importMessageAttachments.run(
          (message as ImportMessageAttachmentMessage).data,
        );
      case OperationType.ImportMessageDetails:
        return this.importMessageTypeDetails.run(
          (message as ImportMessageTypeDetailsMessage).data,
        );
    }
    return DomainResult.Error(new Error("unrecognized operation"));
  }
}
