import { ActionStatus } from '../../core/entities/entities';

export const initialState = {
  aes: {
    status: ActionStatus.IDLE,
    error: '',
    errorType: '',
    key: '1234567890921456',
    cipherText: '',
    plainText: '',
  },
};
