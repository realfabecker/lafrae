import { EmailMessage } from "src/core/domain/email/EmailMessage";
import { EnergyBill as DomainEnergyBill } from "src/core/domain/invoices/EnergyBill";
import { EnergyBill as PersistenceEnergyBill } from "src/database/dynamodb/entities/EnergyBill";
import { Attachment } from "src/core/domain/invoices/Attachment";
import { parse, parseISO } from "date-fns";
import { v7 as uuidv7 } from "uuid";
import { MessageType } from "src/core/domain/enums/MessageType";
import crypto from "node:crypto";

export class EnergyBillMapper {
  static fromPayload(
    emailMessage: EmailMessage,
    userId: string,
    details: Record<string, any>,
  ): DomainEnergyBill {
    const energyBill = new DomainEnergyBill({
      userId: userId,
      id: uuidv7(),
      externalId: emailMessage.getId(),
      consumption: Number(details.consumption.replaceAll(/\D+/g, "")),
      createdAt: new Date(),
      days: Number(details.days),
      dueDate: parse(details.dueDate, "dd/MM/yyyy", new Date()),
      messageType: MessageType.EnergyBill,
      reference: details.reference,
      total: Number(details.total.replace(",", ".")),
    });
    for (const attachment of emailMessage.getAttachment()) {
      const invoiceAttachment = new Attachment({
        id: crypto.randomUUID(),
        externalId: attachment.getId(),
        name: attachment.getName(),
        contentEncoding: attachment.getContentEncoding(),
        contentType: attachment.getContentType(),
        userId: userId,
        createdAt: new Date(),
      });
      energyBill.addAttachment(invoiceAttachment);
    }
    return energyBill;
  }

  public static fromPersistence(energyBill: Record<string, any>) {
    const model = new DomainEnergyBill({
      userId: energyBill.UserId,
      id: energyBill.ID,
      externalId: energyBill.ExternalId,
      consumption: Number(energyBill.Consumption),
      createdAt: parseISO(energyBill.CreatedAt),
      days: Number(energyBill.Days),
      dueDate: parseISO(energyBill.DueDate),
      messageType: energyBill.MessageType,
      reference: energyBill.Reference,
      total: Number(energyBill.Total),
    });
    for (const attachment of energyBill.Attachments) {
      const invoiceAttachment = new Attachment(attachment);
      model.addAttachment(invoiceAttachment);
    }
    return model;
  }

  public static toPersistence(energyBill: DomainEnergyBill) {
    return new PersistenceEnergyBill({
      PK: `app#mailbot#user#${energyBill.getUserId()}`,
      SK: `table#messages#message_type#${MessageType.EnergyBill}#id#${energyBill.getId()}`,
      ID: energyBill.getId(),
      ExternalId: energyBill.getExternalId(),
      UserId: energyBill.getUserId(),
      Reference: energyBill.getReference(),
      Consumption: `${energyBill.getConsumption()}`,
      Days: energyBill.getDays(),
      CreatedAt: energyBill.getCreatedAt().toISOString(),
      DueDate: energyBill.getDueDate().toISOString(),
      Total: energyBill.getTotal(),
      MessageType: energyBill.getMessageType(),
      Attachments: energyBill.getAttachment().map((x) => x.serialize()),
    });
  }
}
