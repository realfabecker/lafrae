import { HttpStatusCode } from "axios";
import { Request, Response, NextFunction } from "express";
import { IJwtProvider } from "src/core/ports/IJwtProvider";

export class DefaultAuthHandler {
  constructor(private readonly jwtProvider: IJwtProvider) {}

  public async auth(
    req: Request,
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

      const user = await this.jwtProvider.verify(token);
      if (!user?.id) {
        return res
          .status(HttpStatusCode.Unauthorized)
          .send() as unknown as Promise<void>;
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}
