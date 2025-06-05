import express, { Request, Response, NextFunction } from "express";
import {
  getGoogleAccessToken,
  getGoogleAuthUrl,
  getGoogleRefreshToken,
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
app.get("/google/callback", async (req: Request, res: Response) => {
  const redirectTo = req.query?.state ?? "";
  const { id_token, refresh_token, access_token } =
    (await getGoogleAccessToken(req.query?.code as string)) ?? {};
  res.redirect(
    `${redirectTo as string}?token=${id_token}&refresh_token=${refresh_token}&access_token=${access_token}`,
  );
});

app.post("/google/verify-id-token", async (req: Request, res: Response) => {
  const { id_token } = req?.body ?? {};
  if (!id_token) {
    res.status(400).send();
  } else {
    res.status(200).send({ token: await verifyIdToken(id_token) });
  }
});

app.post("/google/refresh-token", async (req: Request, res: Response) => {
  const { refresh_token } = req?.body ?? {};
  const token = await getGoogleRefreshToken(refresh_token);
  if (!token?.id_token) {
    res.status(400).send();
  } else {
    res.status(200).send({
      token: {
        refresh_token,
        ...token,
      },
    });
  }
});

// app.post("/google/callback", async (req: Request, res: Response) => {
//   const id_token = req?.body?.credential ?? null;
//   res.redirect(`http://localhost:3100?token=${id_token}`);
// });
app.listen(3100, () => console.log(`Up and running at port 3100!`));
