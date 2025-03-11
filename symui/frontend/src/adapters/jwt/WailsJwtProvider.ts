import { IJWTProvider } from '../../core/ports/ports';
import { injectable } from 'inversify';
import { JwtDecode, JwtEncode } from '../../../wailsjs/go/main/App';

@injectable()
export class WailsJwtProvider implements IJWTProvider {
  async decode(encoded: string): Promise<string> {
    const res = await JwtDecode(encoded);
    if (res.error) throw new Error(res.error);
    return res.decoded!;
  }

  async sign(key: string, content: string): Promise<string> {
    const res = await JwtEncode(key, content);
    if (res.error) throw new Error(res.error);
    return res.encoded!;
  }
}
