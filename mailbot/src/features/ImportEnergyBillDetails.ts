import { EnergyBillMapper } from "adapters/mappers/EnergyBillMapper";
import { DomainResult } from "core/domain/common/DomainResult";
import { CrawlerDoesNotExists } from "core/domain/errors/CrawlerDoesNotExists";
import { NotEnoughtMessageDetails } from "core/domain/errors/NotEnoughMessageDetails";
import { ICrawlerRepository } from "core/ports/ICrawlerRepository";
import { IEmailMessageProvider } from "core/ports/IEmailMessageProvider";
import { IEnergyBillRepository } from "core/ports/IEnergyBillRepository";
import { IMessageDetailExtractor } from "core/ports/IMessageDetailExtractor";

type ImportEnergyBillDetailsOpts = {
  emailProvider: IEmailMessageProvider;
  crawlerRepository: ICrawlerRepository;
  detailExtractor: IMessageDetailExtractor;
  energyBillRepository: IEnergyBillRepository;
};

export class ImportEnergyBillDetails {
  public constructor(private readonly opts: ImportEnergyBillDetailsOpts) {}

  public async run(
    messageId: string,
    crawlerId: string,
  ): Promise<DomainResult> {
    const crawler = await this.opts.crawlerRepository.getCrawler(crawlerId);
    if (!crawler) {
      return DomainResult.Error(new CrawlerDoesNotExists(crawlerId));
    }

    const emailMessage = await this.opts.emailProvider.getMessage(messageId);
    if (!emailMessage.isSuccess()) {
      return emailMessage;
    }

    const details = this.opts.detailExtractor.extract(
      crawler,
      emailMessage.getPayload(),
    );

    const energyBill = EnergyBillMapper.fromEmailAndDetails(
      emailMessage.getPayload(),
      details,
    );
    if (!Object.keys(energyBill)) {
      return DomainResult.Error(new NotEnoughtMessageDetails(messageId));
    }

    const saveRecord = await this.opts.energyBillRepository.save(energyBill);
    if (!saveRecord.isSuccess()) {
      return saveRecord;
    }

    console.log(JSON.stringify(saveRecord.getPayload(), null, "  "));
    return DomainResult.Ok();
  }
}
