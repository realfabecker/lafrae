import { ActionStatus } from '../../core/entities/entities';

export const initialState = {
  jwt: {
    status: ActionStatus.IDLE,
    error: '',
    key: '1af532ec-36c2-434a-8a8c-d4757d2e286c',
    plainText: '',
    encoded: '',
  },
};
