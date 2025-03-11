import { injectable } from 'inversify';
import { IGpgProvider } from '../../core/ports/ports';
import { GpgKey } from '../../core/entities/entities';

@injectable()
export class FakeGpgProvider implements IGpgProvider {
  async listKeys(): Promise<GpgKey[]> {
    return [
      {
        uid: {
          uid: 'realfabecker <realfabecker@outlook.com>',
        },
        pub: {
          type: 'u',
          length: 2048,
          algo: 1,
          keyid: '307B01241C6326FB',
          date: 1696781992,
          expires: 1708457914,
        },
      },
    ];
  }

  async addKey(email: string, weeks: number): Promise<void> {
    console.log({ email, weeks });
    return;
  }
}
