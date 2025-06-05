import { IJwtProvider } from "src/core/ports/IJwtProvider";
import jwt from "jsonwebtoken";

export class JwtProvider implements IJwtProvider {
  constructor(private readonly key: string) {}

  async decode(token: string): Promise<Record<string, any> | null> {
    return jwt.decode(token) as Record<string, any> | null;
  }

  async sign(data: Record<string, any>): Promise<string> {
    return jwt.sign(data, this.key);
  }

  async verify(token: string): Promise<Record<string, any> | null> {
    try {
      return jwt.verify(token, this.key) as Record<string, any>;
    } catch (e) {
      return null;
    }
  }
}
