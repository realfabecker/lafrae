import { ActionStatus } from '../../core/entities/entities';

export const initialState = {
  md5: {
    status: ActionStatus.IDLE,
    error: '',
    hashed: '',
  },
};
