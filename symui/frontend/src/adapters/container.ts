import { Container as IC } from 'inversify';
import { Types } from '../core/ports/types';
import { WailsMd5Hasher } from './md5/WailsMd5Hasher';
import { WailsAesProvider } from './aes/WailsAesProvider';
import { WailsJwtProvider } from './jwt/WailsJwtProvider';
import { WailsBase64Provider } from './base64/WailsBase64Provider';
import { FakeGpgProvider } from './gpg/FakeGpgProvider';

export const container = new IC();
container.bind(Types.IMd5Provider).to(WailsMd5Hasher);
container.bind(Types.IAesProvider).to(WailsAesProvider);
container.bind(Types.IJwtProvider).to(WailsJwtProvider);
container.bind(Types.IBase64Provider).to(WailsBase64Provider);
container.bind(Types.IGpgProvider).to(FakeGpgProvider);
