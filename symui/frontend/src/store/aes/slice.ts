import { createSlice } from '@reduxjs/toolkit';
import { getActionAesDecrypt, getActionAesEncrypt } from './creators';
import { initialState } from './state';
import { ActionStatus } from '../../core/entities/entities';

export const aesSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: (create) => ({
    aes_set_key: create.reducer<string>((state, action) => {
      state.aes.key = action.payload;
    }),
    aes_set_plain: create.reducer<string>((state, action) => {
      state.aes.plainText = action.payload;
    }),
    aes_set_cipher: create.reducer<string>((state, action) => {
      state.aes.cipherText = action.payload;
    }),
  }),

  extraReducers: (builder) => {
    builder.addCase(getActionAesEncrypt.pending, (state) => {
      state.aes.status = ActionStatus.PENDING;
      state.aes.error = '';
      state.aes.errorType = '';
    });
    builder.addCase(getActionAesEncrypt.fulfilled, (state, action) => {
      state.aes.cipherText = action.payload;
      state.aes.status = ActionStatus.FULFILLED;
    });
    builder.addCase(getActionAesEncrypt.rejected, (state, action) => {
      state.aes.status = ActionStatus.REJECTED;
      state.aes.error = action?.error?.message || 'unexpected hash result';
      state.aes.errorType = 'encrypt';
    });
    builder.addCase(getActionAesDecrypt.pending, (state) => {
      state.aes.status = ActionStatus.PENDING;
      state.aes.error = '';
      state.aes.errorType = '';
    });
    builder.addCase(getActionAesDecrypt.fulfilled, (state, action) => {
      state.aes.plainText = action.payload;
      state.aes.status = ActionStatus.FULFILLED;
    });
    builder.addCase(getActionAesDecrypt.rejected, (state, action) => {
      state.aes.status = ActionStatus.REJECTED;
      state.aes.error = action?.error?.message || 'unexpected hash result';
      state.aes.errorType = 'decrypt';
    });
  },
});
