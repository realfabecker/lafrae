import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";
import { ListEnergyBillFilter } from "src/core/domain/filters/ListEnergyBillFilter";

import { IEnergyBillRepository } from "src/core/ports/IEnergyBillRepository";

export class EnergyBillHttpController {
  constructor(private readonly energyBillRepository: IEnergyBillRepository) {}

  public getRouter(route: string): Router {
    const router = Router();
    router.get(route, this.list.bind(this));
    return router;
  }

  private async list(req: Request, res: Response) {
    const response = await this.energyBillRepository.list(
      new ListEnergyBillFilter({
        userId: "01972d36-00b7-7617-b9e5-f228a0545ec2",
      }),
    );

    if (!response.isSuccess()) {
      res.status(HttpStatusCode.BadRequest).send();
    } else {
      res.json(response.getPayload().serialize());
    }
  }
}
