import { IBase64Provider } from '../../core/ports/ports';
import { injectable } from 'inversify';

@injectable()
export class FakeBase64Provider implements IBase64Provider {
  async decode(encoded: string): Promise<string> {
    return encoded;
  }

  async encode(content: string): Promise<string> {
    return content;
  }
}
