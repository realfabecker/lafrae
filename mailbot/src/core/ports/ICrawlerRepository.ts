import { MessageCrawler } from "core/domain/crawler/MessageCrawler";

export interface ICrawlerRepository {
  getCrawler(id: string): Promise<MessageCrawler>;
}
