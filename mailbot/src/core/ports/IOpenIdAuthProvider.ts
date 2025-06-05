import { OpenIdAuth } from "../domain/auth/OpenIdAuth";
import { DomainResult } from "../domain/common/DomainResult";

export interface IOpenIdAuthProvider {
  getAccessToken(
    userId: string,
    openId: string,
  ): Promise<DomainResult<OpenIdAuth>>;
  getAuthUrl(clientId: string, redirectUri: string): DomainResult<string>;
  getAccessTokenFromCode(opts: {
    clientId: string;
    clientSecret: string;
    authorizationCode: string;
    redirectUri: string;
  }): Promise<
    DomainResult<{
      access_token: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
      token_type: string;
      id_token: string;
    }>
  >;
}
