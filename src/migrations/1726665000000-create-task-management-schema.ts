import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskManagementSchema1726665000000
  implements MigrationInterface
{
  name = 'CreateTaskManagementSchema1726665000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(
      `CREATE TYPE "task_status_enum" AS ENUM ('backlog', 'in_progress', 'completed', 'blocked')`,
    );
    await queryRunner.query(
      `CREATE TYPE "task_priority_enum" AS ENUM ('low', 'medium', 'high', 'critical')`,
    );

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying(80) NOT NULL,
        "description" text,
        "color" character varying(7),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE
      )
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_categories_name" ON "categories" (LOWER("name"))`,
    );

    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" character varying(160) NOT NULL,
        "description" text,
        "status" "task_status_enum" NOT NULL DEFAULT 'backlog',
        "priority" "task_priority_enum" NOT NULL DEFAULT 'medium',
        "start_date" TIMESTAMP WITH TIME ZONE,
        "due_date" TIMESTAMP WITH TIME ZONE,
        "estimated_hours" numeric(5,2),
        "actual_hours" numeric(5,2),
        "progress" smallint NOT NULL DEFAULT 0,
        "category_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "CHK_tasks_progress_range" CHECK ("progress" >= 0 AND "progress" <= 100),
        CONSTRAINT "FK_tasks_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_tasks_category" ON "tasks" ("category_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tasks_status_active" ON "tasks" ("status") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tasks_priority_active" ON "tasks" ("priority") WHERE "deleted_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_priority_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_status_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_category"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_categories_name"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);

    await queryRunner.query(`DROP TYPE IF EXISTS "task_priority_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "task_status_enum"`);

    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
