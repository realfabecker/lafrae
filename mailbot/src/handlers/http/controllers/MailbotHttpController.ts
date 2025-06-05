import express from "express";

import { EnergyBillHttpController } from "src/handlers/http/controllers/EnergyBillHttpController";
import { DefaultErrorHandler } from "../middlewares/DefaultErrorHandler";
import { DefaultAuthHandler } from "../middlewares/DefaultAuthHandler";
import { EnergyBillDynamoDbRepository } from "src/database/dynamodb/repositories/EnergyBillDynamoRepository";
import { JwtProvider } from "src/adapters/providers/JwtProvider";

export class MailbotHttpController {
  constructor(
    private readonly opts: {
      authHandler: DefaultAuthHandler;
      energyBillController: EnergyBillHttpController;
    },
  ) {}

  static new() {
    const jwtProvider = new JwtProvider("123456");
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
    app.use(this.opts.energyBillController.getRouter("/energy-bill"));
    app.use(new DefaultErrorHandler().error);
    return app;
  }
}
