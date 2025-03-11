import { injectable } from "inversify";
import {
  IdToken,
  LoginDTO,
  ResponseDTO,
  StateKEnum,
} from "@core/domain/domain";
import { type IAuthService } from "@core/ports/ports";

@injectable()
export class SinteseAuthService implements IAuthService {
  constructor(
    private readonly baseUrl: string = import.meta.env.VITE_API_BASE_URL,
    private readonly storage = localStorage,
    private readonly authKey = StateKEnum.SAuthKey
  ) {}

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    const resp = await fetch(`${this.baseUrl}/auth3/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (resp.status !== 200) {
      throw new Error("Credenciais inválidas");
    }
    const auth = (await resp.json()) as ResponseDTO<LoginDTO>;
    if (!auth.data.AccessToken || !auth.data.RefreshToken) {
      throw new Error("Não foi possível capturar as credenciais");
    }
    this.storage.setItem(this.authKey, JSON.stringify(auth.data));
  }

  getAccessToken(): string | undefined {
    const data = this.storage.getItem(this.authKey);
    if (!data) return;
    const auth = JSON.parse(data) as { AccessToken: string };
    return auth.AccessToken;
  }

  isLoggedIn(): boolean {
    const data = this.storage.getItem(this.authKey);
    if (!data) return false;

    const auth = JSON.parse(data) as { AccessToken: string };
    if (!auth.AccessToken) return false;

    const [, body] = auth.AccessToken.split(".");
    if (!body) return false;

    try {
      const token = JSON.parse(atob(body)) as {
        exp: number;
        [key: string]: unknown;
      };
      return new Date(token.exp * 1000).getTime() > new Date().getTime();
    } catch (e) {
      return false;
    }
  }

  loginToken(accessToken: string, idToken: string): void {
    const data: ResponseDTO<LoginDTO> = {
      status: "success",
      data: {
        AccessToken: accessToken,
        RefreshToken: accessToken,
        IdToken: idToken,
      },
    };
    this.storage.setItem(this.authKey, JSON.stringify(data.data));
  }

  getAuthUrl(redirectTo: string, provider: string = "lambda"): string {
    const url = new URL(import.meta.env.VITE_AUTH_URL);
    url.searchParams.set("client_id", import.meta.env.VITE_AUTH_CLIENT_ID);
    url.searchParams.set("response_type", "token");
    url.searchParams.set(
      "scope",
      "aws.cognito.signin.user.admin email openid profile"
    );
    url.searchParams.set("state", provider);
    url.searchParams.set("redirect_uri", redirectTo);
    return url.toString();
  }

  getIdToken(): IdToken {
    try {
      const data = (this.storage.getItem(this.authKey) || "{}") as string;
      const auth = JSON.parse(data) as { AccessToken: string; IdToken: string };
      return JSON.parse(atob(auth.IdToken.split(".")[1])) as IdToken as IdToken;
    } catch (e) {
      return {} as IdToken;
    }
  }

  logout(): void {
    this.storage.removeItem(this.authKey);
  }
}
