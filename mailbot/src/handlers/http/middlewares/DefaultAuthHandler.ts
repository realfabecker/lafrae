import { HttpStatusCode } from "axios";
import { Response, NextFunction } from "express";
import { UserToken } from "../../../core/domain/auth/UserToken";
import { IRequest } from "../../../core/domain/common/Request";
import { IJwtProvider } from "../../../core/ports/IJwtProvider";

export class DefaultAuthHandler {
  constructor(private readonly jwtProvider: IJwtProvider) {}

  public async auth(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = req.headers["authorization"]?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(HttpStatusCode.Unauthorized)
          .send() as unknown as Promise<void>;
      }

      const user = (await this.jwtProvider.decode(token)) as UserToken;
      if (!user?.username) {
        return res
          .status(HttpStatusCode.Unauthorized)
          .send() as unknown as Promise<void>;
      }

      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  }
}
