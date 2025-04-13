import { IssueProvider } from "core/domain/issues/enums/IssueProvider";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "config", schema: "public" })
@Index(["provider"], { unique: true })
export class Config {
  @PrimaryGeneratedColumn("uuid", { name: "issue_id" })
  id!: string;

  @Column({ type: "varchar", name: "provider_id", nullable: false })
  provider!: IssueProvider;

  @Column({
    type: "timestamptz",
    name: "created_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;

  @Column({ type: "jsonb", name: "config", nullable: true })
  config!: Record<string, any>;
}
