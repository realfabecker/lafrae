import { DomainResult } from "src/core/domain/common/DomainResult";
import { MessageCrawler } from "src/core/domain/crawler/MessageCrawler";
import { EmailMessage } from "src/core/domain/email/EmailMessage";

export interface IMessageDetailExtractor {
  extract(
    crawler: MessageCrawler,
    message: EmailMessage,
  ): DomainResult<Record<string, any>>;
}
