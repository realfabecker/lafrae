import { EmailMessageMapper } from "src/adapters/mappers/EmailMessageMapper";
import { ErrorResultMapper } from "src/adapters/mappers/ErrorResultMapper";
import axios, { AxiosError, AxiosInstance } from "axios";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { EmailListFilter } from "src/core/domain/email/EmailListFilter";
import { EmailMessage } from "src/core/domain/email/EmailMessage";
import { GoogleEmailMessage } from "src/core/domain/google/GoogleEmailMessage";
import { GoogleError } from "src/core/domain/google/GoogleError";
import { IEmailMessageProvider } from "src/core/ports/IEmailMessageProvider";

export class GoogleEmailMessageProvider implements IEmailMessageProvider {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://gmail.googleapis.com",
    });
  }

  public setAuthorization(scheme: string, parameters: string): void {
    this.client.defaults.headers["Authorization"] = `${scheme} ${parameters}`;
  }

  public async getAttachment(
    messageId: string,
    attachmentId: string,
  ): Promise<DomainResult<string>> {
    try {
      const response = await this.client.get<{ size: number; data: string }>(
        `/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`,
      );
      return DomainResult.Ok(response.data.data);
    } catch (e) {
      return ErrorResultMapper.fromGoogle(
        (<AxiosError<{ error: GoogleError }>>e).response?.data?.error!,
      );
    }
  }

  public async getMessage(
    messageId: string,
  ): Promise<DomainResult<EmailMessage>> {
    try {
      const response = await this.client.get<GoogleEmailMessage>(
        `/gmail/v1/users/me/messages/${messageId}`,
      );
      return DomainResult.Ok(EmailMessageMapper.fromGoogle(response.data));
    } catch (e) {
      return ErrorResultMapper.fromGoogle(
        (<AxiosError<{ error: GoogleError }>>e).response?.data?.error!,
      );
    }
  }

  public async listUnread(
    filter: EmailListFilter,
  ): Promise<DomainResult<EmailMessage[]>> {
    try {
      let q = [];
      q.push("is:unread");
      if (filter.getLabel()) {
        q.push(`label:${filter.getLabel()}`);
      }
      const response = await this.client.get<{
        messages: GoogleEmailMessage[];
        resultSizeEstimate: number;
      }>("/gmail/v1/users/me/messages", {
        params: { q: q.join(" ") },
      });
      const messages = (response.data?.messages ?? []).map((item) =>
        EmailMessageMapper.fromGoogle(item),
      );
      return DomainResult.Ok(messages);
    } catch (e) {
      return ErrorResultMapper.fromGoogle(
        (<AxiosError<{ error: GoogleError }>>e).response?.data?.error!,
      );
    }
  }

  public async markAsRead(messageId: string): Promise<DomainResult> {
    try {
      await this.client.post<GoogleEmailMessage>(
        `/gmail/v1/users/me/messages/${messageId}/modify`,
        {
          removeLabelIds: ["UNREAD"],
        },
      );
      return DomainResult.Ok();
    } catch (e) {
      return ErrorResultMapper.fromGoogle(
        (<AxiosError<{ error: GoogleError }>>e).response?.data?.error!,
      );
    }
  }
}
