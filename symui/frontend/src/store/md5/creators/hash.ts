import { createAsyncThunk } from '@reduxjs/toolkit';
import { Container } from 'inversify';
import { Types } from '../../../core/ports/types';
import { IMd5Provider } from '../../../core/ports/ports';

export const getActionMd5Hash = createAsyncThunk(
  'hash.md5/hash',
  async (opts: { input: string }, { extra }) => {
    const container = (<any>extra).container as Container;
    const hasher = container.get<IMd5Provider>(Types.IMd5Provider);
    return hasher.hash(opts.input);
  },
);
