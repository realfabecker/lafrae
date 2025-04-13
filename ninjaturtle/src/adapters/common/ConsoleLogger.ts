import { ILogger } from "core/ports/IConsoleLogger";
import * as winston from "winston";

export class ConsoleLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env?.LOG_LEVEL || "debug",
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.timestamp(),
        winston.format.json(),
      ),
    });
    this.logger.add(new winston.transports.Console());
  }

  public info(message: string, meta?: Record<string, any>): void {
    this.logger.info(this.addslashes(message), meta);
  }

  public error(message: string, meta?: Record<string, any>): void {
    this.logger.error(this.addslashes(message), meta);
  }

  public warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(this.addslashes(message), meta);
  }

  public debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(this.addslashes(message), meta);
  }

  private addslashes(str: string): string {
    return (str + "").replace(/\n+/g, "");
  }
}
