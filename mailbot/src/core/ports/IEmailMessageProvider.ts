import { DomainResult } from "core/domain/common/DomainResult";
import { EmailListFilter } from "core/domain/email/EmailListFilter";
import { EmailMessage } from "core/domain/email/EmailMessage";

export interface IEmailMessageProvider {
  listUnread(filter: EmailListFilter): Promise<DomainResult<EmailMessage[]>>;
  getMessage(messageId: string): Promise<DomainResult<EmailMessage>>;
  getAttachment(
    messageId: string,
    attachmentId: string,
  ): Promise<DomainResult<string>>;
}
