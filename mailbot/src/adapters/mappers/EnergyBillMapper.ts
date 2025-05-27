import { EmailMessage } from "core/domain/email/EmailMessage";
import { EnergyBillInvoice } from "core/domain/invoices/EnergyBillInvoice";
import { InvoiceAttachment } from "core/domain/invoices/InvoiceAttachment";

export class EnergyBillMapper {
  static fromEmailAndDetails(
    emailMessage: EmailMessage,
    details: Record<string, any>,
  ): EnergyBillInvoice {
    const energyBill = new EnergyBillInvoice({
      externalId: emailMessage.getId(),
      ...details,
    });
    for (const attachment of emailMessage.getAttachment()) {
      const invoiceAttachment = new InvoiceAttachment({
        externalId: attachment.getId(),
        name: attachment.getName(),
        contentEncoding: attachment.getContentEncoding(),
        contentType: attachment.getContentType(),
      });
      energyBill.addAttachment(invoiceAttachment);
    }
    return energyBill;
  }
}
