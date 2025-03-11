import { IGpgProvider } from '../../core/ports/ports';
import { injectable } from 'inversify';
import { GpgAddKey, GpgListKeys } from '../../../wailsjs/go/main/App';
import { GpgKey } from '../../core/entities/entities';

@injectable()
export class WailsGpgProvider implements IGpgProvider {
  async listKeys(): Promise<GpgKey[]> {
    const res = await GpgListKeys();
    if (res.error) throw new Error(res.error);
    return res.data;
  }

  async addKey(email: string, weeks: number): Promise<void> {
    const res = await GpgAddKey(email, weeks);
    if (res.error) throw new Error(res.error);
  }
}
