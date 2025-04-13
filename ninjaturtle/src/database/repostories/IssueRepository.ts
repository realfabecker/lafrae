import { IssueMapper } from "@adapters/mappers/IssueMapper";
import { Issue as DomainIssue } from "core/domain/issues/Issue";
import { Issue as IssueEntity } from "database/entities/Issue";
import { IIssueRepository } from "core/ports/IIssueRepository";
import { DataSource } from "typeorm";
import { IssueListFilter } from "core/domain/filters/IssueListFilters";

export class IssueRepository implements IIssueRepository {
  constructor(private readonly d: DataSource) {}

  public async save(issue: DomainIssue): Promise<DomainIssue> {
    if (!issue.getId() && issue.getExternalId()) {
      const issueEntity = await this.findByExternalId(issue.getExternalId());
      issue.setId(issueEntity?.getId() as string);
    }
    if (issue.getId()) {
      return this.update(issue);
    }
    return this.create(issue);
  }

  public async create(issue: DomainIssue): Promise<DomainIssue> {
    const issueEntity = IssueMapper.toPersistence(issue);
    await this.d.getRepository(IssueEntity).save(issueEntity);
    issue.setId(issueEntity.id);
    return issue;
  }

  public async update(issue: DomainIssue): Promise<DomainIssue> {
    const issueEntity = IssueMapper.toPersistence(issue);
    await this.d
      .getRepository(IssueEntity)
      .update({ id: issue.getId() }, issueEntity);
    return issue;
  }

  public async findByExternalId(
    externalId: string,
  ): Promise<DomainIssue | null> {
    const issueEntity = await this.d
      .getRepository(IssueEntity)
      .findOneBy({ external_id: externalId });
    if (!issueEntity) return null;
    return IssueMapper.toDomain(issueEntity);
  }

  public async count(filter: IssueListFilter): Promise<number> {
    const qb = this.d
      .getRepository(IssueEntity)
      .createQueryBuilder("issue")
      .offset(filter.getOffset())
      .limit(filter.getPageSize());
    if (filter.getStatus()) {
      qb.andWhere("issue.status = :status");
      qb.setParameter("status", filter.getStatus());
    }
    return qb.getCount();
  }

  public async list(filter: IssueListFilter): Promise<DomainIssue[]> {
    const qb = this.d
      .getRepository(IssueEntity)
      .createQueryBuilder("issue")
      .addOrderBy(filter.getSortBy(), filter.getSortDir())
      .offset(filter.getOffset())
      .limit(filter.getPageSize());
    if (filter.getStatus()) {
      qb.andWhere("issue.status = :status");
      qb.setParameter("status", filter.getStatus());
    }
    return (await qb.getMany()).map((h) => IssueMapper.toDomain(h));
  }
}
