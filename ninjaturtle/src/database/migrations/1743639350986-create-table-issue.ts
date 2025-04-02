import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableIssue1743639350986 implements MigrationInterface {
    name = 'CreateTableIssue1743639350986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "issue"."issue" ("issue_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "external_id" character varying NOT NULL, "title" text NOT NULL, "assignee" character varying(255) NOT NULL, "status" character varying(255) NOT NULL, "provider" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "link" text, "config" jsonb, CONSTRAINT "PK_b81abd818e577b25e839a5b08e0" PRIMARY KEY ("issue_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9d37d35c7088ca0b0284b8d005" ON "issue"."issue" ("provider", "external_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e01cbf475b54a9ed57b8a08ae3" ON "issue"."issue" ("created_at", "status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "issue"."IDX_e01cbf475b54a9ed57b8a08ae3"`);
        await queryRunner.query(`DROP INDEX "issue"."IDX_9d37d35c7088ca0b0284b8d005"`);
        await queryRunner.query(`DROP TABLE "issue"."issue"`);
    }

}
