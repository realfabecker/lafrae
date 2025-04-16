import express, { NextFunction, Request, Response } from "express";
import { ConsoleLogger } from "@adapters/common/ConsoleLogger";
import { IssuesRouter } from "./IssuesRouter";

export class HttpApp {
  private readonly app: express.Application;
  constructor(private readonly logger = new ConsoleLogger()) {
    this.app = express();
    this.app.use(express.json());
  }

  listen(port: number): void {
    this.app.listen(port, (p) => this.logger.info(`App is up and running`));
  }

  register(): void {
    const router = express.Router();

    const issues = new IssuesRouter();
    router.get("/issues", issues.getIssues.bind(issues));
    router.get("/issues/:id", issues.getIssueDetailByInternalId.bind(issues));

    this.app.use("/api", router);
    this.app.use(this.error.bind(this));
  }

  error(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
}
