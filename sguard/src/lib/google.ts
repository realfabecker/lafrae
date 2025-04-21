import axios from "axios";
import * as qs from "node:querystring";

const config = {
  google: {
    client_id: "",
    client_secret: "",
    redirect_uri: "https://api.oauth.local.com.br/google/callback",
    auth_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    token_endpoint: "https://oauth2.googleapis.com/token",
  },
};

export async function getGoogleAuthUrl(redirectTo: string): Promise<string> {
  const query = {
    response_type: "code",
    client_id: config.google.client_id,
    scope: "openid profile email",
    redirect_uri: config.google.redirect_uri,
    state: redirectTo,
  };
  return `${config.google.auth_endpoint}?${qs.encode(query)}`;
}

export async function getGoogleAccessToken(
  code: string,
): Promise<string | null> {
  const path = qs.encode({
    code,
    client_id: config.google.client_id,
    client_secret: config.google.client_secret,
    redirect_uri: config.google.redirect_uri,
    grant_type: "authorization_code",
  });
  const response = await axios
    .create({
      validateStatus: (status) => !!status,
    })
    .post<{ id_token: string }>(`${config.google.token_endpoint}?${path}`);
  return response?.data?.id_token || null;
}
