import { createSlice } from '@reduxjs/toolkit';
import { getActionMd5Hash } from './creators';
import { initialState } from './state';
import { ActionStatus } from '../../core/entities/entities';

export const md5Slice = createSlice({
  name: 'md5Slice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActionMd5Hash.pending, (state) => {
      state.md5.status = ActionStatus.PENDING;
      state.md5.error = '';
    });
    builder.addCase(getActionMd5Hash.fulfilled, (state, action) => {
      state.md5.hashed = action.payload;
      state.md5.status = ActionStatus.FULFILLED;
      state.md5.error = '';
    });
    builder.addCase(getActionMd5Hash.rejected, (state, action) => {
      state.md5.status = ActionStatus.REJECTED;
      state.md5.error = action?.error?.message || 'unexpected hash result';
    });
  },
});
