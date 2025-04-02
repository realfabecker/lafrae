import { IssueMapper } from "@adapters/mappers/IssueMapper";
import { Issue as DomainIssue } from "core/domain/Issue";
import { Issue as IssueEntity } from "database/entities/Issue";
import { IIssueRepository } from "core/ports/IIssueRepository";
import { DataSource } from "typeorm";

export class IssueRepository implements IIssueRepository {
  constructor(private readonly d: DataSource) {}

  public async create(issue: DomainIssue): Promise<DomainIssue> {
    const issueEntity = IssueMapper.toPersistence(issue);
    await this.d.getRepository(IssueEntity).save(issueEntity);
    issue.setId(issueEntity.id);
    return issue;
  }
}
