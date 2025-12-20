import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("tenant_id", "uuid", (col) =>
      col.notNull().references("tenants.id").onDelete("cascade")
    )
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("google_id", "text", (col) => col.notNull().unique())
    .addColumn("full_name", "text")
    .addColumn("avatar", "text")
    .addColumn("email_verified", "boolean", (col) =>
      col.notNull().defaultTo(true)
    )
    .addColumn("is_active", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addUniqueConstraint("users_tenant_email_unique", ["tenant_id", "email"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("users").execute()
}
