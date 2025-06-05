import axios from "axios";
import jwt from "jsonwebtoken";
import jwktopem, { JWK } from "jwk-to-pem";
import * as qs from "node:querystring";

type Jwk = {
  e: string;
  kid: string;
  use: string;
  n: string;
  alg: string;
  kty: string;
};

const config = {
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "http://localhost:3100/google/callback",
    auth_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    token_endpoint: "https://oauth2.googleapis.com/token",
    jwk_uri: "https://www.googleapis.com/oauth2/v3/certs",
  },
};

export async function getJwkPublicKeys(): Promise<{ keys: JWK[] }> {
  const response = await axios
    .create({ validateStatus: (status) => !!status })
    .get<{ keys: JWK[] }>(config.google.jwk_uri);
  return response.data;
}

export async function verifyIdToken(
  idToken: string,
): Promise<jwt.JwtPayload | boolean> {
  const { keys } = await getJwkPublicKeys();
  for (const k of keys) {
    try {
      return jwt.verify(idToken, jwktopem(k)) as jwt.JwtPayload;
    } catch (e) {
      console.log("verifyIdToken", e);
    }
  }
  return false;
}

export async function getGoogleAuthUrl(redirectTo: string): Promise<string> {
  const query = {
    response_type: "code",
    client_id: config.google.client_id,
    scope:
      "openid profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify",
    redirect_uri: config.google.redirect_uri,
    state: redirectTo,
    access_type: "offline",
    prompt: "consent",
  };
  return `${config.google.auth_endpoint}?${qs.encode(query)}`;
}

export async function getGoogleAccessToken(code: string): Promise<{
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
} | null> {
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
  //@ts-ignore
  return response?.data?.id_token ? response?.data : null;
}

export async function getGoogleRefreshToken(refresh_token: string): Promise<{
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
  refresh_token_expires_in: number;
} | null> {
  const path = qs.encode({
    grant_type: "refresh_token",
    client_id: config.google.client_id,
    client_secret: config.google.client_secret,
    refresh_token,
  });
  const response = await axios
    .create({
      validateStatus: (status) => !!status,
    })
    .post<{ id_token: string }>(`${config.google.token_endpoint}?${path}`);
  //@ts-ignore
  return response?.data?.id_token ? response?.data : null;
}
