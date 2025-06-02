import { DomainResult } from "src/core/domain/common/DomainResult";
import { EmailListFilter } from "src/core/domain/email/EmailListFilter";
import { EmailMessage } from "src/core/domain/email/EmailMessage";

export interface IEmailMessageProvider {
  setAuthorization(scheme: string, parameters: string): void;
  listUnread(filter: EmailListFilter): Promise<DomainResult<EmailMessage[]>>;
  getMessage(messageId: string): Promise<DomainResult<EmailMessage>>;
  getAttachment(
    messageId: string,
    attachmentId: string,
  ): Promise<DomainResult<string>>;
  markAsRead(messageId: string): Promise<DomainResult>;
}
