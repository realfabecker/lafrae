import { DomainResult } from "../../../src/core/domain/common/DomainResult";
import { MessageCrawler } from "../../../src/core/domain/crawler/MessageCrawler";
import { EmailMessage } from "../../../src/core/domain/email/EmailMessage";
import { IMessageDetailExtractor } from "../../../src/core/ports/IMessageDetailExtractor";

export class RegexMessageDetailExtractor implements IMessageDetailExtractor {
  public extract(
    crawler: MessageCrawler,
    message: EmailMessage,
  ): DomainResult<Record<string, any>> {
    const data: Record<string, any> = {};
    for (const o of crawler.getProviderPattern()) {
      const r = new RegExp(o.getPattern(), "m");
      const t = message.getBody().match(r);
      if (t?.groups?.v == undefined) {
        return DomainResult.Error(
          new Error(
            `${message.getId()} doesn't match pattern: ${o.getPattern()}`,
          ),
        );
      }
      data[o.getProperty()] = t.groups.v;
    }
    return DomainResult.Ok(data);
  }
}
