export interface ILogger {
  info(message: string, meta?: { [k: string]: any }): void;
  error(message: string, meta?: { [k: string]: any }): void;
  warn(message: string, meta?: { [k: string]: any }): void;
  debug(message: string, meta?: { [k: string]: any }): void;
}
