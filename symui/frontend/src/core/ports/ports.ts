import { GpgKey } from '../entities/entities';

export interface IMd5Provider {
  hash(input: string): Promise<string>;
}

export interface IAESProvider {
  encrypt(key: string, plainText: string): Promise<string>;
  decrypt(key: string, cipherText: string): Promise<string>;
}

export interface IJWTProvider {
  sign(key: string, content: string): Promise<string>;
  decode(encoded: string): Promise<string>;
}

export interface IBase64Provider {
  encode(content: string): Promise<string>;
  decode(encoded: string): Promise<string>;
}

export interface IGpgProvider {
  listKeys(): Promise<GpgKey[]>;
  addKey(email: string, weeks: number): Promise<void>;
}
