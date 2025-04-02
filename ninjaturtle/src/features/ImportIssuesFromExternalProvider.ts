import { IExternalProvider } from "core/ports/IExternalProvider";
import { IRepositoryProvider } from "core/ports/IRepositoryProvider";

export class ImportIssuesFromExternalProvider {
  constructor(
    private readonly externalProvider: IExternalProvider,
    private readonly databaseProvider: IRepositoryProvider,
  ) {}

  public async run() {
    const external = this.externalProvider.getExternalIssueProvider();
    const repository = this.databaseProvider.getIssueRepository();

    for await (const issue of external.paginate(
      "assignee=currentUser()+order+by+created+asc",
    )) {
      const domainIssue = await repository.create(issue);
      console.log({ domainIssue });
    }
  }
}
