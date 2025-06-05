export enum Topic {
  Mailbot = "https://ntfy.sh/01970d909c05720ab8978a31286be49b_mailbot",
}

export interface ILogger {
  info(message: string, meta?: { [k: string]: any }): void;
  error(message: string, meta?: { [k: string]: any }): void;
  warn(message: string, meta?: { [k: string]: any }): void;
  debug(message: string, meta?: { [k: string]: any }): void;
  notify(topic: string, message: string): Promise<void>;
}
