import { MessageCrawler } from "src/core/domain/crawler/MessageCrawler";
import { ProviderPattern } from "src/core/domain/crawler/ProviderPattern";
import { ICrawlerRepository } from "src/core/ports/ICrawlerRepository";

export class CrawlerInMemRepository implements ICrawlerRepository {
  async getCrawler(id: string): Promise<MessageCrawler> {
    const crawler = new MessageCrawler({
      id: "123456",
      providerFilter: "faturas-celesc",
    });
    const patterns = [
      new ProviderPattern({
        pattern: "Valor da fatura:\\s+R\\$\\s+(?<v>\\d+,\\d+)\r?\n",
        property: "total",
      }),
      new ProviderPattern({
        pattern: "Data de vencimento:\\s+(?<v>\\d+\/\\d+\/\\d+)\r?\n",
        property: "dueDate",
      }),
      new ProviderPattern({
        pattern: "Número de dias faturados:\\s+(?<v>\\d+)\\sdias",
        property: "days",
      }),
      new ProviderPattern({
        pattern: "Consumo registrado:\\s+(?<v>\\d+\\skWh)\r?\n",
        property: "consumption",
      }),
      new ProviderPattern({
        pattern: "Mês de referência:\\s+(?<v>\\d+\/\\d+)\r?\n",
        property: "reference",
      }),
    ];
    crawler.setProviderPattern(patterns);
    return crawler;
  }
}
