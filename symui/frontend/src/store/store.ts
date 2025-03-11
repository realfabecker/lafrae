import { configureStore } from '@reduxjs/toolkit';
import { container } from '../adapters/container';
import { md5Slice } from './md5';
import { aesSlice } from './aes';
import { jwtSlice } from './jwt';
import { base64Slice } from './base64';
import { gpgSlice } from './gpg';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: { extraArgument: { container } },
    });
  },
  reducer: {
    md5: md5Slice.reducer,
    aes: aesSlice.reducer,
    jwt: jwtSlice.reducer,
    base64: base64Slice.reducer,
    gpg: gpgSlice.reducer,
  },
});
