import { AbstractModel } from "../common/AbstractModel";
import { OperationType } from "../enums/OperationType";
import {
  ImportMessageAttachmentMessage,
  ImportMessageTypeDetailsMessage,
} from "../schemas/ImportMessage";

export class OperationMessage extends AbstractModel {
  public static newImportMessageTypeDetails({
    userId,
    crawlerId,
    messageId,
  }: {
    userId: string;
    crawlerId: string;
    messageId: string;
  }): ImportMessageTypeDetailsMessage {
    return {
      meta: {
        operation: OperationType.ImportMessageDetails,
      },
      data: {
        userId,
        crawlerId,
        messageId,
      },
    };
  }

  public static newImportMessageAttachments({
    messageId,
    userId,
    crawlerId,
  }: {
    userId: string;
    crawlerId: string;
    messageId: string;
  }): ImportMessageAttachmentMessage {
    return {
      meta: {
        operation: OperationType.ImportMessageAttachments,
      },
      data: {
        messageId,
        userId,
        crawlerId,
      },
    };
  }
}
