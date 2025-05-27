import { DomainResult } from "core/domain/common/DomainResult";
import { MessageCrawler } from "core/domain/crawler/MessageCrawler";
import { EmailListFilter } from "core/domain/email/EmailListFilter";
import { CrawlerDoesNotExists } from "core/domain/errors/CrawlerDoesNotExists";
import { ICrawlerRepository } from "core/ports/ICrawlerRepository";
import { IEmailMessageProvider } from "core/ports/IEmailMessageProvider";

type ScheduleEnergyBillsImportOpts = {
  emailProvider: IEmailMessageProvider;
  crawlerRepository: ICrawlerRepository;
};

export class ScheduleEnergyBillsImport {
  constructor(private readonly opts: ScheduleEnergyBillsImportOpts) {}

  public async run(crawlerId: string): Promise<DomainResult> {
    const crawler = await this.opts.crawlerRepository.getCrawler(crawlerId);
    if (!crawler) {
      return DomainResult.Error(new CrawlerDoesNotExists(crawlerId));
    }

    const filter = new EmailListFilter({ label: crawler.getProviderFilter() });
    const messagesResult = await this.opts.emailProvider.listUnread(filter);

    if (!messagesResult.isSuccess()) {
      return messagesResult;
    }

    for (const message of messagesResult.getPayload()) {
      console.log(message.getId());
    }

    return DomainResult.Ok();
  }
}
