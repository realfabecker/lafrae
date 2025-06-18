import { EmailAttachment } from "../../../src/core/domain/email/EmailAttachment";
import { EmailMessage } from "../../../src/core/domain/email/EmailMessage";
import { GoogleEmailMessage } from "../../../src/core/domain/google/GoogleEmailMessage";

export class EmailMessageMapper {
  static fromGoogle(message: GoogleEmailMessage): EmailMessage {
    let emailBody: string | undefined;
    if (message?.payload?.parts) {
      const emailBodyB64 = (message?.payload?.parts || [])
        .filter((p) => p.mimeType === "multipart/alternative")[0]
        .parts.filter((p) => p.mimeType === "text/plain")[0].body.data;
      if (emailBodyB64) {
        emailBody = Buffer.from(emailBodyB64, "base64").toString("utf8");
      }
    }
    let attachments: EmailAttachment[] = [];
    if (message?.payload?.parts) {
      attachments = message.payload.parts
        .filter((p) => p.mimeType === "application/pdf")
        .map((a) => {
          return new EmailAttachment({
            id: a.body.attachmentId,
            name: a.filename,
            contentEncoding: "base64",
            contentType: "application/pdf",
          });
        });
    }
    return new EmailMessage({
      id: message.id,
      body: emailBody,
      attachment: attachments,
    });
  }
}
