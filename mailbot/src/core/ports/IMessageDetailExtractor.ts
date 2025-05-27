import { MessageCrawler } from "core/domain/crawler/MessageCrawler";
import { EmailMessage } from "core/domain/email/EmailMessage";

export interface IMessageDetailExtractor {
  extract(crawler: MessageCrawler, message: EmailMessage): Record<string, any>;
}
