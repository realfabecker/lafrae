import { createSlice } from '@reduxjs/toolkit';
import { getActionJwtDecode, getActionJwtEncode } from './creators';
import { initialState } from './state';
import { ActionStatus } from '../../core/entities/entities';

export const jwtSlice = createSlice({
  name: 'jwt',
  initialState,
  reducers: (create) => ({
    jwt_set_key: create.reducer<string>((state, action) => {
      state.jwt.key = action.payload;
    }),
    jwt_set_plain: create.reducer<string>((state, action) => {
      state.jwt.plainText = action.payload;
    }),
    jwt_set_encoded: create.reducer<string>((state, action) => {
      state.jwt.encoded = action.payload;
    }),
  }),

  extraReducers: (builder) => {
    builder.addCase(getActionJwtEncode.pending, (state) => {
      state.jwt.status = ActionStatus.PENDING;
      state.jwt.error = '';
    });
    builder.addCase(getActionJwtEncode.fulfilled, (state, action) => {
      state.jwt.encoded = action.payload;
      state.jwt.status = ActionStatus.FULFILLED;
    });
    builder.addCase(getActionJwtEncode.rejected, (state, action) => {
      state.jwt.status = ActionStatus.REJECTED;
      state.jwt.error = action?.error?.message || 'unexpected jwt result';
      state.jwt.encoded = state.jwt.error;
    });
    builder.addCase(getActionJwtDecode.pending, (state) => {
      state.jwt.status = ActionStatus.PENDING;
      state.jwt.error = '';
    });
    builder.addCase(getActionJwtDecode.fulfilled, (state, action) => {
      state.jwt.plainText = action.payload;
      state.jwt.status = ActionStatus.FULFILLED;
    });
    builder.addCase(getActionJwtDecode.rejected, (state, action) => {
      state.jwt.status = ActionStatus.REJECTED;
      state.jwt.error = action?.error?.message || 'unexpected decode result';
      state.jwt.plainText = state.jwt.error;
    });
  },
});
