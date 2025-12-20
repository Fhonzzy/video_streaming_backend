import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("upload_sessions")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("tenant_id", "uuid", (col) =>
      col.notNull().references("tenants.id").onDelete("cascade")
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("status", "text", (col) =>
      col
        .notNull()
        .defaultTo("initiated")
        .check(sql`status IN ('initiated', 'uploading', 'completed', 'failed')`)
    )
    .addColumn("file_name", "text", (col) => col.notNull())
    .addColumn("mime_type", "text", (col) => col.notNull())
    .addColumn("file_size", "bigint", (col) =>
      col.notNull().check(sql`file_size > 0`)
    )
    .addColumn("uploaded_byte", "bigint", (col) => col.notNull().defaultTo(0))
    .addColumn("storage_key", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createIndex("upload_sessions_tenant_id_idx")
    .on("upload_sessions")
    .column("tenant_id")
    .execute();

  await db.schema
    .createIndex("upload_sessions_user_id_idx")
    .on("upload_sessions")
    .column("user_id")
    .execute();

  await db.schema
    .createIndex("upload_sessions_status_idx")
    .on("upload_sessions")
    .column("status")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("upload_sessions").execute();
}
