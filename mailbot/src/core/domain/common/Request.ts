import { Request } from "express";
import { UserToken } from "../auth/UserToken";

export type IRequest = Request & {
  user?: UserToken;
};
