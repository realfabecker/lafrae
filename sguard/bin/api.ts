import express, { Request, Response, NextFunction } from "express";
import {
  getGoogleAccessToken,
  getGoogleAuthUrl,
  verifyIdToken,
} from "lib/google";

const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  next();
});

app.post("/google/auth-url", async (req: Request, res: Response) => {
  const { redirectTo } = req?.body ?? {};
  if (!redirectTo) {
    res.status(400).send();
  } else {
    res.status(200).send({ url: await getGoogleAuthUrl(redirectTo) });
  }
});
app.post("/google/verify-id-token", async (req: Request, res: Response) => {
  const { id_token } = req?.body ?? {};
  if (!id_token) {
    res.status(400).send();
  } else {
    res.status(200).send({ token: await verifyIdToken(id_token) });
  }
});
app.get("/google/callback", async (req: Request, res: Response) => {
  const redirectTo = req.query?.state ?? "";
  const id_token = await getGoogleAccessToken(req.query?.code as string);
  res.redirect(`${redirectTo as string}?token=${id_token}`);
});
app.post("/google/callback", async (req: Request, res: Response) => {
  const id_token = req?.body?.credential ?? null;
  res.redirect(`http://web.oauth.local.com.br?token=${id_token}`);
});
app.listen(3100, () => console.log(`Up and running at port 3100!`));
