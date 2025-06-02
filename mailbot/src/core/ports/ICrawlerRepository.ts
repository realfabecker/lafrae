import { MessageCrawler } from "src/core/domain/crawler/MessageCrawler";

export interface ICrawlerRepository {
  getCrawler(id: string): Promise<MessageCrawler>;
}
