import { IAESProvider } from '../../core/ports/ports';
import { injectable } from 'inversify';

@injectable()
export class FakeAesProvider implements IAESProvider {
  async encrypt(key: string, plainText: string): Promise<string> {
    return `encrypt:{${key}:${plainText}}`;
  }

  async decrypt(key: string, cipherText: string): Promise<string> {
    return `decrypt:{${key}:${cipherText}}`;
  }
}
