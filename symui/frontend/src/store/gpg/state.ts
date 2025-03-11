import { ActionStatus, GpgKey } from '../../core/entities/entities';

export const initialState = {
  gpg: {
    status: ActionStatus.IDLE,
    keys: [] as GpgKey[],
    error: '',
  },
};
