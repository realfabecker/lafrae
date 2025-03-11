import { IBase64Provider } from '../../core/ports/ports';
import { injectable } from 'inversify';
import { Base64Decode, Base64Encode } from '../../../wailsjs/go/main/App';

@injectable()
export class WailsBase64Provider implements IBase64Provider {
  async encode(content: string): Promise<string> {
    const res = await Base64Encode(content);
    if (res.error) throw new Error(res.error);
    return res.encoded!;
  }

  async decode(encoded: string): Promise<string> {
    const res = await Base64Decode(encoded);
    if (res.error) throw new Error(res.error);
    return res.decoded!;
  }
}
