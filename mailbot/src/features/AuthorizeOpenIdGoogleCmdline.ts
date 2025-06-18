import { GoogleOpenIdProvider } from "../../src/adapters/providers/GoogleOpenIdProvider";
import express, { Request, Response } from "express";
import { OpenIdAuth } from "../../src/core/domain/auth/OpenIdAuth";
import { IOpenIdAuthRepository } from "../../src/core/ports/IOpenIdAuthRepository";
import { DomainResult } from "../../src/core/domain/common/DomainResult";
import { HttpStatusCode } from "axios";

export class AuthorizaOpenIdGoogleCmdline {
  constructor(
    private readonly opts: {
      openIdProvider: GoogleOpenIdProvider;
      openIdRepository: IOpenIdAuthRepository;
    },
  ) {}

  public async run({
    userId,
    clientId,
    clientSecret,
    callbackUrl,
  }: {
    userId: string;
    clientId: string;
    clientSecret: string;
    callbackUrl: URL;
  }): Promise<DomainResult> {
    const googleAuthUrl = this.opts.openIdProvider.getAuthUrl(
      clientId,
      callbackUrl.href,
    );

    console.log(`Google Authorization Url: ${googleAuthUrl.getPayload()}`);

    const app = express();
    app.get(callbackUrl.pathname, async (req: Request, res: Response) => {
      try {
        const token = await this.opts.openIdProvider.getAccessTokenFromCode({
          authorizationCode: req.query.code as string,
          clientId,
          clientSecret,
          redirectUri: callbackUrl.href,
        });
        const saveToken = await this.opts.openIdRepository.save(
          new OpenIdAuth({
            id: "google",
            userId,
            accessToken: token.getPayload().access_token,
            refreshToken: token.getPayload().refresh_token,
            clientId,
            clientSecret,
          }),
        );
        if (!saveToken.isSuccess()) {
          throw new Error(saveToken.getError().getErrorDescription());
        }
        res.status(HttpStatusCode.Ok).json(token.getPayload());
      } catch (e) {
        res
          .status(HttpStatusCode.BadRequest)
          .send(`error: ${(<Error>e).message}`);
      } finally {
        server.close();
        process.exit(0);
      }
    });
    const server = app.listen(3100);
    return DomainResult.Ok();
  }
}
