import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableIssuesAndConfig1744560179961 implements MigrationInterface {
    name = 'CreateTableIssuesAndConfig1744560179961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "issue" ("issue_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "external_id" character varying NOT NULL, "title" text NOT NULL, "assignee" character varying(255) NOT NULL, "status" character varying(255) NOT NULL, "provider" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "link" text, "config" jsonb, "issue_type" character varying(255) NOT NULL, "priority" character varying(255), "sprint" character varying(255), "team" character varying(255), "story_points" smallint, CONSTRAINT "PK_b81abd818e577b25e839a5b08e0" PRIMARY KEY ("issue_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9d37d35c7088ca0b0284b8d005" ON "issue" ("provider", "external_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e01cbf475b54a9ed57b8a08ae3" ON "issue" ("created_at", "status") `);
        await queryRunner.query(`CREATE TABLE "config" ("issue_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "config" jsonb, CONSTRAINT "PK_870a744869ac3ea31444094499b" PRIMARY KEY ("issue_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c18a86163a2c2b5e762c8cca3e" ON "config" ("provider_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c18a86163a2c2b5e762c8cca3e"`);
        await queryRunner.query(`DROP TABLE "config"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e01cbf475b54a9ed57b8a08ae3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d37d35c7088ca0b0284b8d005"`);
        await queryRunner.query(`DROP TABLE "issue"`);
    }
}
