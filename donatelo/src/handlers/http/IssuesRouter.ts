import { Engine } from "@adapters/Engine";
import { DomainSerializer } from "core/domain/DomainSerializer";
import { IssueRepository } from "database/repostories/IssueRepository";
import express from "express";
import { GetIssueDetailsByInternalIssueId } from "features/GetIssueDetailsByInternalIssueId";
import { SearchForIssuesWithPagedOutput } from "features/SearchForIssuesWithPagedOutput";

export class IssuesRouter {
  public async getIssueDetailByInternalId(
    req: express.Request,
    res: express.Response,
  ) {
    const dataSource = (
      await Engine.getInstance().getPostgresDataSource()
    ).getDataSource();

    const feature = new GetIssueDetailsByInternalIssueId({
      issueRepository: new IssueRepository(dataSource),
    });

    const page = await feature.run(req.params?.id);
    res
      .status(page.isSuccess() ? 200 : 404)
      .json(DomainSerializer.serialize(page));
  }

  public async getIssues(req: express.Request, res: express.Response) {
    const dataSource = (
      await Engine.getInstance().getPostgresDataSource()
    ).getDataSource();

    const feature = new SearchForIssuesWithPagedOutput({
      issueRepository: new IssueRepository(dataSource),
    });

    const page = await feature.run();
    res
      .status(page.isSuccess() ? 200 : 422)
      .json(DomainSerializer.serialize(page));
  }
}
