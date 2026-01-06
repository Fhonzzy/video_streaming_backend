import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("video_permissions")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("tenant_id", "uuid", (col) =>
      col.notNull().references("tenants.id").onDelete("cascade")
    )

    .addColumn("video_id", "uuid", (col) =>
      col.notNull().references("videos.id").onDelete("cascade")
    )

    .addColumn("user_id", "uuid", (col) =>
      col.references("users.id").onDelete("cascade")
    )

    .addColumn("permission", "text", (col) =>
      col.notNull().check(sql`permission IN ('view', 'comment', 'edit')`)
    )

    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  // Prevent duplicate permissions
  await db.schema
    .createIndex("video_permissions_unique_idx")
    .on("video_permissions")
    .columns(["video_id", "user_id", "permission"])
    .unique()
    .execute();

  // Query performance
  await db.schema
    .createIndex("video_permissions_video_id_idx")
    .on("video_permissions")
    .column("video_id")
    .execute();

  await db.schema
    .createIndex("video_permissions_user_id_idx")
    .on("video_permissions")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("video_permissions").execute();
}
