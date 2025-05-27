import { DomainResult } from "core/domain/common/DomainResult";
import { InvoiceObjectKey } from "core/domain/invoices/fields/InvoiceObjectKey";
import { IEmailMessageProvider } from "core/ports/IEmailMessageProvider";
import { IEnergyBillRepository } from "core/ports/IEnergyBillRepository";
import { IObjectStorageRepository } from "core/ports/IObjectStorageRepository";

export class ImportEnergyBillAttachments {
  public constructor(
    private readonly emailProvider: IEmailMessageProvider,
    private readonly energyBillRepository: IEnergyBillRepository,
    private readonly objectStorageRepository: IObjectStorageRepository,
  ) {}

  public async run(energiBilId: string): Promise<DomainResult> {
    const energyBill = await this.energyBillRepository.findById(energiBilId);

    if (!energyBill.isSuccess()) {
      return energyBill;
    }
    if (!energyBill.getPayload()?.getAttachment()?.length) {
      return DomainResult.Ok();
    }

    const attachments = energyBill.getPayload().getAttachment();
    for (let i = 0; i < attachments.length; i++) {
      const getAttachmentResult = await this.emailProvider.getAttachment(
        energyBill.getPayload().getExternalId(),
        attachments[i].getExternalId(),
      );

      if (!getAttachmentResult.isSuccess()) {
        return getAttachmentResult;
      }
      const objectKey = InvoiceObjectKey.fromEnergyBill(
        energyBill.getPayload(),
        attachments[i],
      ).getValue();

      const updloadResult = await this.objectStorageRepository.upload({
        key: objectKey,
        content: getAttachmentResult.getPayload(),
        contentEncoding: attachments[i].getContentEncoding(),
        contentType: attachments[i].getContentType(),
      });
      if (!updloadResult.isSuccess()) {
        return updloadResult;
      }
      attachments[0].setObjectUrl(objectKey);
    }

    await this.energyBillRepository.upsertAttachments(energiBilId, attachments);
    return DomainResult.Ok();
  }
}
