import { IJWTProvider } from '../../core/ports/ports';
import { injectable } from 'inversify';

@injectable()
export class FakeJwtProvider implements IJWTProvider {
  async sign(key: string, content: string): Promise<string> {
    return `encrypt:{${key}:${content}}`;
  }

  async decode(encoded: string): Promise<string> {
    return `decrypt:{${encoded}}`;
  }
}
