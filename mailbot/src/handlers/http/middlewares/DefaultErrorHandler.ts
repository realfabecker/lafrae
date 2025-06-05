import { HttpStatusCode } from "axios";
import { Request, Response, NextFunction } from "express";

export class DefaultErrorHandler {
  public error(err: Error, req: Request, res: Response, next: NextFunction) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: "error", message: err.message });
  }
}
