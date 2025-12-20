import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("videos")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("tenant_id", "uuid", (col) =>
      col.notNull().references("tenants.id").onDelete("cascade")
    )
    .addColumn("owner_id", "uuid", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("status", "text", (col) =>
      col
        .notNull()
        .defaultTo("draft")
        .check(
          sql`status IN ('draft', 'uploading', 'processing', 'ready', 'failed')`
        )
    )
    .addColumn("visibility", "text", (col) =>
      col
        .notNull()
        .defaultTo("public")
        .check(sql`visibility IN ('private', 'unlisted', 'public')`)
    )
    .addColumn("duration_seconds", "integer")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("videos").execute()
}
