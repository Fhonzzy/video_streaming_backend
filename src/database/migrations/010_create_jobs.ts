import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("jobs")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )

    .addColumn("type", "text", (col) => col.notNull())

    .addColumn("payload", "jsonb", (col) => col.notNull())

    .addColumn("status", "text", (col) => col.notNull().defaultTo("pending"))

    .addColumn("attempts", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("max_attempts", "integer", (col) => col.notNull().defaultTo(3))

    .addColumn("run_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )

    .addColumn("locked_at", "timestamptz")

    .addColumn("error", "text")

    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )

    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )

    .execute();

  // Index for job polling
  await db.schema
    .createIndex("jobs_polling_idx")
    .on("jobs")
    .columns(["status", "run_at"])
    .execute();

  // Index for worker locking
  await db.schema
    .createIndex("jobs_locked_at_idx")
    .on("jobs")
    .column("locked_at")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("jobs").execute();
}
