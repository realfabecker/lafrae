import { DomainResult } from "src/core/domain/common/DomainResult";
import { EmailListFilter } from "src/core/domain/email/EmailListFilter";
import { EmailMessage } from "src/core/domain/email/EmailMessage";
import { CrawlerDoesNotExists } from "src/core/domain/errors/CrawlerDoesNotExists";
import { OperationMessage } from "src/core/domain/messages/OperationMessage";
import { IMessageCrawlerConfigRepository } from "src/core/ports/ICrawlerRepository";
import { IEmailMessageProvider } from "src/core/ports/IEmailMessageProvider";
import { ILogger } from "src/core/ports/ILogger";
import { IOpenIdAuthProvider } from "src/core/ports/IOpenIdAuthProvider";
import { IQueueProvider } from "src/core/ports/IQueueProvider";

type ScheduleMessageTypeImportOpts = {
  openIdProvider: IOpenIdAuthProvider;
  emailProvider: IEmailMessageProvider;
  crawlerRepository: IMessageCrawlerConfigRepository;
  queueProvider: IQueueProvider;
  logger: ILogger;
};

export class ScheduleMessageTypeImport {
  constructor(private readonly opts: ScheduleMessageTypeImportOpts) {}

  public async run({
    userId,
    crawlerId,
  }: {
    userId: string;
    crawlerId: string;
  }): Promise<DomainResult> {
    const crawler = await this.opts.crawlerRepository.getCrawler(crawlerId);
    if (!crawler) {
      return DomainResult.Error(new CrawlerDoesNotExists(crawlerId));
    }

    const openId = await this.opts.openIdProvider.getAccessToken(
      userId,
      crawler.getAuthProvider(),
    );
    if (!openId.isSuccess()) {
      return openId;
    }

    this.opts.emailProvider.setAuthorization(
      "Bearer",
      openId.getPayload().getAccessToken(),
    );

    const filter = new EmailListFilter({ label: crawler.getProviderFilter() });
    const messagesResult = await this.opts.emailProvider.listUnread(filter);

    if (!messagesResult.isSuccess()) {
      return DomainResult.Error(new Error("não foi possível obter mensagens"));
    }

    if (!messagesResult.getPayload()?.length) {
      this.opts.logger.info("não há mensagens para o filtro");
      return DomainResult.Ok();
    }

    return this.schedule(userId, crawlerId, messagesResult.getPayload() ?? []);
  }

  private async schedule(
    userId: string,
    crawlerId: string,
    messages: EmailMessage[],
  ) {
    for (const message of messages) {
      this.opts.logger.info(`schedule mensagem ${message.getId()}`);
      const payload = OperationMessage.newImportMessageTypeDetails({
        messageId: message.getId(),
        crawlerId: crawlerId,
        userId: userId,
      });
      await this.opts.queueProvider.publish(payload);
    }
    return DomainResult.Ok();
  }
}
