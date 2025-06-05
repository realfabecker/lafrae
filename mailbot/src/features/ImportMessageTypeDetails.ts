import { EnergyBillMapper } from "src/adapters/mappers/EnergyBillMapper";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { CrawlerDoesNotExists } from "src/core/domain/errors/CrawlerDoesNotExists";
import { NotEnoughtMessageDetails } from "src/core/domain/errors/NotEnoughMessageDetails";
import { OperationMessage } from "src/core/domain/messages/OperationMessage";
import { IMessageCrawlerConfigRepository } from "src/core/ports/ICrawlerRepository";
import { IEmailMessageProvider } from "src/core/ports/IEmailMessageProvider";
import { IEnergyBillRepository } from "src/core/ports/IEnergyBillRepository";
import { ILogger } from "src/core/ports/ILogger";
import { IMessageDetailExtractor } from "src/core/ports/IMessageDetailExtractor";
import { IOpenIdAuthProvider } from "src/core/ports/IOpenIdAuthProvider";
import { IQueueProvider } from "src/core/ports/IQueueProvider";

type ImportMessageTypeDetailsOpts = {
  openIdProvider: IOpenIdAuthProvider;
  emailProvider: IEmailMessageProvider;
  crawlerRepository: IMessageCrawlerConfigRepository;
  detailExtractor: IMessageDetailExtractor;
  energyBillRepository: IEnergyBillRepository;
  queueProvider: IQueueProvider;
  logger: ILogger;
};

export class ImportMessageTypeDetails {
  public constructor(private readonly opts: ImportMessageTypeDetailsOpts) {}

  public async run({
    userId,
    crawlerId,
    messageId,
  }: {
    userId: string;
    messageId: string;
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

    const getEmailMessage = await this.opts.emailProvider.getMessage(messageId);
    if (!getEmailMessage.isSuccess()) return getEmailMessage;

    const extractDetails = this.opts.detailExtractor.extract(
      crawler,
      getEmailMessage.getPayload(),
    );
    if (!extractDetails.isSuccess()) {
      return DomainResult.Error(new NotEnoughtMessageDetails(messageId));
    }

    const energyBill = EnergyBillMapper.fromPayload(
      getEmailMessage.getPayload(),
      userId,
      extractDetails.getPayload(),
    );
    if (!Object.keys(energyBill)) {
      return DomainResult.Error(new NotEnoughtMessageDetails(messageId));
    }

    const saveEnegyBil = await this.opts.energyBillRepository.save(energyBill);
    if (!saveEnegyBil.isSuccess()) return saveEnegyBil;

    const markAsRead = await this.opts.emailProvider.markAsRead(messageId);
    if (!markAsRead.isSuccess() || !energyBill.getAttachment?.()?.length) {
      return markAsRead;
    }

    const payload = OperationMessage.newImportMessageAttachments({
      userId: userId,
      crawlerId: crawlerId,
      messageId: energyBill.getId(),
    });
    return this.opts.queueProvider.publish(payload);
  }
}
