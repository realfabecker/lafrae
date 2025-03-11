import { injectable } from 'inversify';
import { IMd5Provider } from '../../core/ports/ports';

@injectable()
export class FakeMd5Hasher implements IMd5Provider {
  async hash(input: string): Promise<string> {
    return input;
  }
}
