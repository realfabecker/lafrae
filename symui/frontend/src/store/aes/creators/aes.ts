import { createAsyncThunk } from '@reduxjs/toolkit';
import { Container } from 'inversify';
import { IAESProvider } from '../../../core/ports/ports';
import { Types } from '../../../core/ports/types';

export const getActionAesEncrypt = createAsyncThunk(
  'crypto.aes/encrypt',
  async (opts: { key: string; plainText: string }, { extra }) => {
    const container = (<any>extra).container as Container;
    const aes = container.get<IAESProvider>(Types.IAesProvider);
    return aes.encrypt(opts.key, opts.plainText);
  },
);

export const getActionAesDecrypt = createAsyncThunk(
  'crypto.aes/decrypt',
  async (opts: { key: string; cipherText: string }, { extra }) => {
    const container = (<any>extra).container as Container;
    const aes = container.get<IAESProvider>(Types.IAesProvider);
    return aes.decrypt(opts.key, opts.cipherText);
  },
);
