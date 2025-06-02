import {
  DynamoDBClient,
  DynamoDBClientConfig,
  TransactionCanceledException,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { EnergyBillMapper } from "src/adapters/mappers/EnergyBillMapper";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { MessageAlreadyExists } from "src/core/domain/errors/MessageAlreadyExists";
import { UnableToCreateInvoice } from "src/core/domain/errors/UnabletToCreateInvoice";
import { Attachment } from "src/core/domain/invoices/Attachment";
import { EnergyBill } from "src/core/domain/invoices/EnergyBill";
import { IEnergyBillRepository } from "src/core/ports/IEnergyBillRepository";

export class EnergyBillDynamoDbRepository implements IEnergyBillRepository {
  private readonly client: DynamoDBDocumentClient;

  constructor(private readonly tableName: string) {
    let config: DynamoDBClientConfig = {
      region: "us-east-1",
    };
    if (process.env.AWS_ENDPOINT) {
      config = {
        ...config,
        endpoint: process.env.AWS_ENDPOINT,
      };
    }
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient(config));
  }

  async save(energyBill: EnergyBill): Promise<DomainResult<EnergyBill>> {
    try {
      const message = EnergyBillMapper.toPersistence(energyBill);
      const command = new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              Item: message.serialize(),
              ConditionExpression:
                "attribute_not_exists(PK) and attribute_not_exists(SK)",
              TableName: this.tableName,
            },
          },
          {
            Put: {
              Item: {
                PK: message.getPK(),
                SK: `message#external_id#${message.getExternalId()}`,
                MessageSK: message.getSK(),
              },
              ConditionExpression:
                "attribute_not_exists(PK) and attribute_not_exists(SK)",
              TableName: this.tableName,
            },
          },
        ],
      });
      const result = await this.client.send(command);
      if (result.$metadata.httpStatusCode !== 200) {
        return DomainResult.Error(new UnableToCreateInvoice());
      }
      return DomainResult.Ok(energyBill);
    } catch (e) {
      if (e instanceof TransactionCanceledException) {
        const duplicated = e.CancellationReasons?.find(
          (x) => x.Code === "ConditionalCheckFailed",
        );
        if (duplicated) {
          return DomainResult.Error(new MessageAlreadyExists());
        }
      }
      return DomainResult.Error(<Error>e);
    }
  }

  async findById(
    userId: string,
    messageId: string,
  ): Promise<DomainResult<EnergyBill | null>> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `app#mailbot#user#${userId}`,
          SK: `message#${messageId}`,
        },
      });
      const result = await this.client.send(command);
      if (result.$metadata.httpStatusCode !== 200) {
        return DomainResult.Error(new UnableToCreateInvoice());
      }
      if (!result.Item) {
        return DomainResult.Ok(null);
      }
      return DomainResult.Ok(EnergyBillMapper.fromPersistence(result.Item));
    } catch (e) {
      return DomainResult.Error(<Error>e);
    }
  }

  async upsertAttachments(
    id: string,
    attachments: Attachment[],
  ): Promise<DomainResult> {
    return DomainResult.Ok();
  }
}
