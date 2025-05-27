import { MessageCrawler } from "core/domain/crawler/MessageCrawler";
import { EmailMessage } from "core/domain/email/EmailMessage";
import { IMessageDetailExtractor } from "core/ports/IMessageDetailExtractor";

export class RegexMessageDetailExtractor implements IMessageDetailExtractor {
  public extract(
    crawler: MessageCrawler,
    message: EmailMessage,
  ): Record<string, any> {
    const data: Record<string, any> = {};
    for (const o of crawler.getProviderPattern()) {
      const r = new RegExp(o.getPattern(), "m");
      const t = message.getBody().match(r);
      if (typeof t?.groups?.v !== undefined) {
        data[o.getProperty()] = t?.groups?.v as string;
      }
    }
    return data;
  }
}
