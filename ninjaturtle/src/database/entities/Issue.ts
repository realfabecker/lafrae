import { IssueProvider } from "core/domain/issues/enums/IssueProvider";
import { IssueStatus } from "core/domain/issues/enums/IssueStatus";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "issue", schema: "public" })
@Index(["created_at", "status"])
@Index(["provider", "external_id"], { unique: true })
export class Issue {
  @PrimaryGeneratedColumn("uuid", { name: "issue_id" })
  id!: string;

  @Column({ type: "varchar", name: "external_id", nullable: false })
  external_id!: string;

  @Column({ type: "text", name: "title", nullable: false })
  title!: string;

  @Column({ type: "varchar", name: "assignee", length: 255, nullable: false })
  assignee!: string;

  @Column({ type: "varchar", name: "status", length: 255, nullable: false })
  status!: IssueStatus;

  @Column({ type: "varchar", name: "provider", length: 255, nullable: false })
  provider!: IssueProvider;

  @Column({
    type: "timestamptz",
    name: "created_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;

  @Column({ type: "text", name: "link", nullable: true })
  link!: string;

  @Column({ type: "jsonb", name: "config", nullable: true })
  config!: Record<string, any>;

  @Column({ type: "varchar", name: "issue_type", length: 255, nullable: false })
  issueType!: string;

  @Column({ type: "varchar", name: "priority", length: 255, nullable: true })
  priority!: string;

  @Column({ type: "varchar", name: "sprint", length: 255, nullable: true })
  sprint!: string;

  @Column({ type: "varchar", name: "team", length: 255, nullable: true })
  team!: string;

  @Column({
    type: "smallint",
    name: "story_points",
    nullable: true,
  })
  storyPoints!: number;
}
