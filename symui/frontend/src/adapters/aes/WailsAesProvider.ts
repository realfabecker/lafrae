import { IAESProvider } from '../../core/ports/ports';
import { AesDecrypt, AesEncrypt } from '../../../wailsjs/go/main/App';
import { injectable } from 'inversify';

@injectable()
export class WailsAesProvider implements IAESProvider {
  async encrypt(key: string, plainText: string): Promise<string> {
    const res = await AesEncrypt(key, plainText);
    if (res.error) throw new Error(res.error);
    return res.cipher;
  }

  async decrypt(key: string, cipherText: string): Promise<string> {
    const res = await AesDecrypt(key, cipherText);
    if (res.error) throw new Error(res.error);
    return res.plainText;
  }
}
