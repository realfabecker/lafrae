import { IssueProvider } from "core/enum/IssueProvider";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "issue", schema: "issue" })
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
  status!: string;

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
}
