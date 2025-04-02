import * as fs from "node:fs";
import * as path from "node:path";
import * as yaml from "yaml";

export class YamlConfigReader {
  private config!: Record<string, any>;

  constructor(private readonly configName: string) {}

  getConfig(): Record<string, any> {
    if (!this.config) {
      let filePath: string;
      if (fs.existsSync(this.configName)) {
        filePath = this.configName;
      } else {
        filePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "config",
          this.configName,
        );
      }
      this.config = yaml.parse(fs.readFileSync(filePath, "utf8"));
    }
    return this.config;
  }
}
