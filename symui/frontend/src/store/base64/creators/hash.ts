import { createAsyncThunk } from '@reduxjs/toolkit';
import { Container } from 'inversify';
import { Types } from '../../../core/ports/types';
import { IBase64Provider } from '../../../core/ports/ports';

export const getActionBase64Encode = createAsyncThunk(
  'hash.base64/encode',
  async (opts: { input: string }, { extra }) => {
    const container = (<any>extra).container as Container;
    const hasher = container.get<IBase64Provider>(Types.IBase64Provider);
    return hasher.encode(opts.input);
  },
);

export const getActionBase64Decode = createAsyncThunk(
  'hash.base64/decode',
  async (opts: { input: string }, { extra }) => {
    const container = (<any>extra).container as Container;
    const hasher = container.get<IBase64Provider>(Types.IBase64Provider);
    return hasher.decode(opts.input);
  },
);
