import { AbstractModel } from "../common/AbstractModel";
import { ProviderPattern } from "./ProviderPattern";

type MessageCrawlerOpts = {
  id: string;
  userId: string;
  authProvider: string;
  messageType: string;
  providerFilter: string;
  providerPattern: ProviderPattern[];
};

export class MessageCrawler extends AbstractModel {
  constructor(opts: Partial<MessageCrawlerOpts>) {
    super(opts);
  }

  public getId(): string {
    return this.get("id");
  }

  public setId(id: string): void {
    this.set("id", id);
  }

  public getUserId(): string {
    return this.get("userId");
  }

  public setUserId(userId: string): void {
    this.set("userId", userId);
  }

  public getAuthProvider(): string {
    return this.get("authProvider");
  }

  public setAuthProvider(authProvider: string): void {
    this.set("authProvider", authProvider);
  }

  public getMessageType(): string {
    return this.get("messageType");
  }

  public setMessageType(messageType: string): void {
    this.set("messageType", messageType);
  }

  public getProviderFilter(): string {
    return this.get("providerFilter");
  }

  public setProviderFilter(providerFilter: string): void {
    this.set("providerFilter", providerFilter);
  }

  public getProviderPattern(): ProviderPattern[] {
    return this.get("providerPattern");
  }

  public setProviderPattern(providerPattern: ProviderPattern[]): void {
    this.set("providerPattern", providerPattern);
  }
}
