export class CrawlerDoesNotExists extends Error {
  constructor(crawlerId: string) {
    super(`Crawler ${crawlerId} does not exists`);
  }
}
