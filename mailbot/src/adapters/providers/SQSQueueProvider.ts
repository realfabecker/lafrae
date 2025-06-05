import { IQueueProvider } from "src/core/ports/IQueueProvider";
import {
  SQSClient,
  SendMessageCommand,
  SQSClientConfig,
} from "@aws-sdk/client-sqs";
import { DomainResult } from "src/core/domain/common/DomainResult";

export class SQSQueueProvider implements IQueueProvider {
  private readonly client: SQSClient;

  constructor(private readonly queueUrl: string) {
    let config: SQSClientConfig = {
      region: process.env.AWS_DEFAULT_REGION ?? "us-east-1",
    };
    if (process.env.AWS_ENDPOINT) {
      config = {
        ...config,
        endpoint: process.env.AWS_ENDPOINT,
      };
    }
    this.client = new SQSClient(config);
  }

  async publish(message: Record<string, any>): Promise<DomainResult<void>> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(message),
      });
      const result = await this.client.send(command);
      if (result.$metadata.httpStatusCode !== 200) {
        return DomainResult.Error(
          new Error(`Unable to pub status: ${result.$metadata.httpStatusCode}`),
        );
      }
      return DomainResult.Ok();
    } catch (e) {
      return DomainResult.Error(
        new Error(`Unable to pub error: ${(<Error>e).message}`),
      );
    }
  }
}
