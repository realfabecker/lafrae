import express from "express";

import { EnergyBillHttpController } from "./EnergyBillHttpController";
import { DefaultErrorHandler } from "../middlewares/DefaultErrorHandler";
import { DefaultAuthHandler } from "../middlewares/DefaultAuthHandler";
import { JwtProvider } from "../../../adapters/providers/JwtProvider";
import { EnergyBillDynamoDbRepository } from "../../../database/dynamodb/repositories/EnergyBillDynamoRepository";

export class MailbotHttpController {
  constructor(
    private readonly opts: {
      authHandler: DefaultAuthHandler;
      energyBillController: EnergyBillHttpController;
    },
  ) {}

  static new() {
    const jwtProvider = new JwtProvider(process.env.JWT_KEY as string);
    return new MailbotHttpController({
      authHandler: new DefaultAuthHandler(jwtProvider),
      energyBillController: new EnergyBillHttpController(
        new EnergyBillDynamoDbRepository("sintese", jwtProvider),
      ),
    });
  }

  getApp(): express.Application {
    const app = express();

    app.use(express.json());
    app.use(this.opts.authHandler.auth.bind(this.opts.authHandler));

    const router = express.Router();
    router.use(this.opts.energyBillController.getRouter("/energy"));

    app.use("/mailbot", router);
    app.use(new DefaultErrorHandler().error);
    return app;
  }
}
