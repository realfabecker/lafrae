import { AbstractModel } from "../common/AbstractModel";

type GoogleAuthProviderOpts = {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
};

export class GoogleAuthProvider extends AbstractModel {
  constructor(opts: Partial<GoogleAuthProviderOpts>) {
    super(opts);
  }

  public setId(id: string) {
    this.set("id", id);
  }

  public getId(): string {
    return this.get("id");
  }

  public getAccessToken(): string {
    return this.get("accessToken");
  }

  public getRefreshToken(): string {
    return this.get("refreshToken");
  }

  public setAccessToken(accessToken: string): void {
    this.set("accessToken", accessToken);
  }

  public setRefreshToken(refreshToken: string): void {
    this.set("refreshToken", refreshToken);
  }

  public getUserId(): string {
    return this.get("userId");
  }

  public setUserId(userId: string): void {
    this.set("userId", userId);
  }
}
