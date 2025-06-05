import axios from "axios";
import qs from "node:querystring";
import { OpenIdAuth } from "src/core/domain/auth/OpenIdAuth";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { OpenIdAuthDoestNotExists } from "src/core/domain/errors/OpenIdAuthDoesNotExists";
import { ILogger, Topic } from "src/core/ports/ILogger";
import { IOpenIdAuthProvider } from "src/core/ports/IOpenIdAuthProvider";
import { IOpenIdAuthRepository } from "src/core/ports/IOpenIdAuthRepository";

export class GoogleOpenIdProvider implements IOpenIdAuthProvider {
  constructor(
    private readonly opendIdRepository: IOpenIdAuthRepository,
    private readonly logger: ILogger,
  ) {}

  public async getAccessToken(
    userId: string,
    openId: string,
  ): Promise<DomainResult<OpenIdAuth>> {
    const openIdAuth = await this.opendIdRepository.findById(userId, openId);
    if (!openIdAuth.getPayload()) {
      return DomainResult.Error(new OpenIdAuthDoestNotExists());
    }

    const refreshTokenResult = await this.refreshAccessToken(
      openIdAuth.getPayload()!,
    );

    if (!refreshTokenResult.isSuccess()) {
      await this.logger.notify(
        Topic.Mailbot,
        refreshTokenResult.getError().getErrorDescription(),
      );
      return refreshTokenResult as unknown as DomainResult<OpenIdAuth>;
    }

    openIdAuth.getPayload()?.setAccessToken(refreshTokenResult.getPayload());
    return this.opendIdRepository.save(openIdAuth.getPayload()!);
  }

  private async refreshAccessToken(
    openIdAuth: OpenIdAuth,
  ): Promise<DomainResult<string>> {
    try {
      const response = await axios
        .create({
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .post<{
          access_token: string;
          expires_in: number;
          scope: string;
          token_type: string;
          id_token: string;
          refresh_token_expires_in: number;
        }>(`https://oauth2.googleapis.com/token`, {
          grant_type: "refresh_token",
          client_id: openIdAuth.getClientId(),
          client_secret: openIdAuth.getClientSecret(),
          refresh_token: openIdAuth.getRefreshToken(),
        });

      return DomainResult.Ok(response.data.access_token);
    } catch (e) {
      return DomainResult.Error(
        new Error(`unable to refresh token: ${(<Error>e).message}`),
      );
    }
  }

  public getAuthUrl(
    clientId: string,
    redirectUri: string,
  ): DomainResult<string> {
    const query = {
      response_type: "code",
      client_id: clientId,
      scope: [
        "openid",
        "profile",
        "email",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
      ].join(" "),
      redirect_uri: redirectUri,
      access_type: "offline",
      prompt: "consent",
    };
    return DomainResult.Ok(
      `https://accounts.google.com/o/oauth2/v2/auth?${qs.encode(query)}`,
    );
  }

  public async getAccessTokenFromCode({
    clientId,
    clientSecret,
    redirectUri,
    authorizationCode,
  }: {
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
  > {
    const response = await axios
      .create({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: (status) => !!status,
      })
      .post<{ id_token: string }>(`https://oauth2.googleapis.com/token`, {
        code: authorizationCode,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      });
    if (!response.data?.id_token) {
      return DomainResult.Error(
        new Error(`error: ${JSON.stringify(response?.data)}`),
      );
    }
    return DomainResult.Ok(response.data);
  }
}
