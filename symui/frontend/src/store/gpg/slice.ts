import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { ActionStatus } from '../../core/entities/entities';
import { getActionGpgAddKey, getActionGpgListKeys } from './creators';

export const gpgSlice = createSlice({
  name: 'gpgSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActionGpgListKeys.pending, (state) => {
      state.gpg.status = ActionStatus.PENDING;
    });
    builder.addCase(getActionGpgListKeys.fulfilled, (state, action) => {
      state.gpg.keys = action.payload;
      state.gpg.status = ActionStatus.FULFILLED;
    });
    builder.addCase(getActionGpgListKeys.rejected, (state, payload) => {
      state.gpg.status = ActionStatus.REJECTED;
      state.gpg.error = payload?.error?.message || 'unexpected gpg list error';
    });
    builder.addCase(getActionGpgAddKey.pending, (state) => {
      state.gpg.status = ActionStatus.PENDING;
    });
    builder.addCase(getActionGpgAddKey.rejected, (state, payload) => {
      state.gpg.status = ActionStatus.REJECTED;
      state.gpg.error = payload?.error?.message || 'unexpected gpg gen error';
    });
    builder.addCase(getActionGpgAddKey.fulfilled, (state) => {
      state.gpg.status = ActionStatus.FULFILLED;
    });
  },
});
