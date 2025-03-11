import { createAsyncThunk } from '@reduxjs/toolkit';
import { Container } from 'inversify';
import { IJWTProvider } from '../../../core/ports/ports';
import { Types } from '../../../core/ports/types';

export const getActionJwtEncode = createAsyncThunk(
  'jwt/encode',
  async (opts: { key: string; plainText: string }, { extra }) => {
    const container = (<any>extra).container as Container;
    const jwt = container.get<IJWTProvider>(Types.IJwtProvider);
    return jwt.sign(opts.key, opts.plainText);
  },
);

export const getActionJwtDecode = createAsyncThunk(
  'jwt/decode',
  async (opts: { key: string; encoded: string }, { extra }) => {
    const container = (<any>extra).container as Container;
    const jwt = container.get<IJWTProvider>(Types.IJwtProvider);
    return jwt.decode(opts.encoded);
  },
);
