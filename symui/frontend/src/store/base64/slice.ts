import { createSlice } from '@reduxjs/toolkit';
import { getActionBase64Decode, getActionBase64Encode } from './creators';
import { initialState } from './state';
import { ActionStatus } from '../../core/entities/entities';

export const base64Slice = createSlice({
  name: 'base64Slice',
  initialState,
  reducers: (create) => ({
    aes_set_plain: create.reducer<string>((state, action) => {
      state.base64.plainText = action.payload;
    }),
    aes_set_encode: create.reducer<string>((state, action) => {
      state.base64.encoded = action.payload;
    }),
  }),

  extraReducers: (builder) => {
    builder.addCase(getActionBase64Encode.pending, (state) => {
      state.base64.status = ActionStatus.PENDING;
      state.base64.error = '';
    });
    builder.addCase(getActionBase64Encode.fulfilled, (state, action) => {
      state.base64.encoded = action.payload;
      state.base64.status = ActionStatus.FULFILLED;
      state.base64.error = '';
    });
    builder.addCase(getActionBase64Encode.rejected, (state, action) => {
      state.base64.status = ActionStatus.REJECTED;
      state.base64.error = action?.error?.message || 'unexpected hash result';
    });

    builder.addCase(getActionBase64Decode.pending, (state) => {
      state.base64.status = ActionStatus.PENDING;
      state.base64.error = '';
    });
    builder.addCase(getActionBase64Decode.fulfilled, (state, action) => {
      state.base64.plainText = action.payload;
      state.base64.status = ActionStatus.FULFILLED;
      state.base64.error = '';
    });
    builder.addCase(getActionBase64Decode.rejected, (state, action) => {
      state.base64.status = ActionStatus.REJECTED;
      state.base64.error = action?.error?.message || 'unexpected hash result';
    });
  },
});
