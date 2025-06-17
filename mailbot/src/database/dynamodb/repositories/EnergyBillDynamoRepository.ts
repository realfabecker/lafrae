import {
  DynamoDBClient,
  DynamoDBClientConfig,
  TransactionCanceledException,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  QueryCommandInput,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { EnergyBillMapper } from "src/adapters/mappers/EnergyBillMapper";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { MessageType } from "src/core/domain/enums/MessageType";
import { MessageAlreadyExists } from "src/core/domain/errors/MessageAlreadyExists";
import { UnableToListInvoices } from "src/core/domain/errors/UnableToListInvoices";
import { UnableToCreateInvoice } from "src/core/domain/errors/UnabletToCreateInvoice";
import { ListEnergyBillFilter } from "src/core/domain/filters/ListEnergyBillFilter";
import { EnergyBill } from "src/core/domain/invoices/EnergyBill";
import { Page } from "src/core/domain/paged/Page";
import { IEnergyBillRepository } from "src/core/ports/IEnergyBillRepository";
import { IJwtProvider } from "src/core/ports/IJwtProvider";

export class EnergyBillDynamoDbRepository implements IEnergyBillRepository {
  private readonly client: DynamoDBDocumentClient;

  constructor(
    private readonly tableName: string,
    private readonly jwtProvider: IJwtProvider,
  ) {
    let config: DynamoDBClientConfig = {
      region: process.env.AWS_DEFAULT_REGION ?? "us-east-1",
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
                SK: `table#messages#message_type#${MessageType.EnergyBill}#external_id#${message.getExternalId()}`,
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

  async list(
    filter: ListEnergyBillFilter,
  ): Promise<DomainResult<Page<EnergyBill>>> {
    const query: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
      ScanIndexForward: false,
      Limit: filter.getLimit(),
      ExpressionAttributeValues: {
        ":pk": `app#mailbot#user#${filter.getUserId()}`,
        ":sk": "table#messages#message_type#energy_bill#id#",
      },
    };

    if (filter.getPageToken()) {
      const key = (await this.jwtProvider.verify(
        filter.getPageToken(),
      )) as Record<string, any>;
      query.ExclusiveStartKey = { PK: key?.PK, SK: key?.SK };
    }

    const command = new QueryCommand(query);

    const result = await this.client.send(command);
    if (result.$metadata.httpStatusCode !== 200) {
      return DomainResult.Error(new UnableToListInvoices());
    }

    const invoices = result.Items?.map((item) =>
      EnergyBillMapper.fromPersistence(item),
    );

    const page = Page.fromList({ items: invoices ?? [] });
    if (result.LastEvaluatedKey) {
      page.setPageToken(await this.jwtProvider.sign(result.LastEvaluatedKey));
    }

    return DomainResult.Ok(page);
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
          SK: `table#messages#message_type#${MessageType.EnergyBill}#id#${messageId}`,
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
}
