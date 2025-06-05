import { DomainResult } from "src/core/domain/common/DomainResult";
import { CrawlerDoesNotExists } from "src/core/domain/errors/CrawlerDoesNotExists";
import { Attachment } from "src/core/domain/invoices/Attachment";
import { EnergyBill } from "src/core/domain/invoices/EnergyBill";
import { IMessageCrawlerConfigRepository } from "src/core/ports/ICrawlerRepository";
import { IEmailMessageProvider } from "src/core/ports/IEmailMessageProvider";
import { IEnergyBillRepository } from "src/core/ports/IEnergyBillRepository";
import { ILogger } from "src/core/ports/ILogger";
import { IObjectStorageRepository } from "src/core/ports/IObjectStorageRepository";
import { IOpenIdAuthProvider } from "src/core/ports/IOpenIdAuthProvider";

export class ImportMessageAttachment {
  public constructor(
    private readonly opts: {
      openIdProvider: IOpenIdAuthProvider;
      crawlerRepository: IMessageCrawlerConfigRepository;
      emailProvider: IEmailMessageProvider;
      energyBillRepository: IEnergyBillRepository;
      objectStorageRepository: IObjectStorageRepository;
      logger: ILogger;
    },
  ) {}

  public async run({
    userId,
    crawlerId,
    messageId,
  }: {
    userId: string;
    crawlerId: string;
    messageId: string;
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

    const fetchMessageResult = await this.opts.energyBillRepository.findById(
      userId,
      messageId,
    );
    if (!fetchMessageResult.getPayload()) {
      return DomainResult.Error(new Error(`msg ${messageId} not exists`));
    }
    if (!fetchMessageResult.getPayload()?.getAttachment()?.length) {
      this.opts.logger.info(`msg ${messageId} has no attachs`);
      return DomainResult.Ok();
    }
    return this.processAttachments(
      fetchMessageResult.getPayload() as EnergyBill,
    );
  }

  protected async processAttachments(energyBill: EnergyBill) {
    for (const attachment of energyBill.getAttachment()) {
      const fetchAndSaveResult = await this.fetchAndSaveAttachment(
        energyBill.getExternalId(),
        attachment,
      );
      if (!fetchAndSaveResult.isSuccess()) {
        return fetchAndSaveResult;
      }
    }
    return DomainResult.Ok();
  }

  protected async fetchAndSaveAttachment(
    externalId: string,
    attachment: Attachment,
  ) {
    const getAttachmentResult = await this.opts.emailProvider.getAttachment(
      externalId,
      attachment.getExternalId(),
    );
    if (!getAttachmentResult.isSuccess()) {
      return getAttachmentResult;
    }
    return this.opts.objectStorageRepository.upload({
      key: attachment.getObjectUrl(),
      content: getAttachmentResult.getPayload(),
      contentEncoding: attachment.getContentEncoding(),
      contentType: attachment.getContentType(),
    });
  }
}
