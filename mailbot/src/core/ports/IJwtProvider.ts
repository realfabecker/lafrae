export interface IJwtProvider {
  sign(data: Record<string, any>): Promise<string>;
  decode(token: string): Promise<Record<string, any> | null>;
  verify(token: string): Promise<Record<string, any> | null>;
}
