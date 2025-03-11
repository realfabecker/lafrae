import { injectable } from "inversify";
import {
  IdToken,
  LoginDTO,
  ResponseDTO,
  StateKEnum,
} from "@core/domain/domain";
import { IAuthService } from "@core/ports/ports";

@injectable()
export class LocalAuthService implements IAuthService {
  constructor(
    private readonly baseUrl: string = import.meta.env.VITE_API_BASE_URL,
    private readonly storage = localStorage,
    private readonly authKey = StateKEnum.LAuthKey
  ) {}

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    console.log({ baseUrl: this.baseUrl });
    const token = btoa(`${email}:${password}`);
    const data: ResponseDTO<LoginDTO> = {
      status: "success",
      data: { AccessToken: token, RefreshToken: token, IdToken: token },
    };
    this.storage.setItem(this.authKey, JSON.stringify(data.data));
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

  getAccessToken(): string | undefined {
    const data = this.storage.getItem(this.authKey);
    if (!data) return;
    const auth = JSON.parse(data) as { AccessToken: string };
    return auth.AccessToken;
  }

  getIdToken(): IdToken {
    return {
      picture: "https://rafaelbecker.dev/profile.jpg",
    } as IdToken;
  }

  isLoggedIn(): boolean {
    return !!this.storage.getItem(this.authKey);
  }

  getAuthUrl(redirectTo: string, provider: string = "picsum"): string {
    return redirectTo + "?provider=" + provider;
  }

  logout(): void {
    this.storage.removeItem(this.authKey);
  }
}
