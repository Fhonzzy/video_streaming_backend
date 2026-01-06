import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("video_views")
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
      col.references("users.id").onDelete("set null")
    )

    .addColumn("ip_hash", "text")

    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )

    .execute();

  //Indexes for analytics & performance
  await db.schema
    .createIndex("video_views_video_id_idx")
    .on("video_views")
    .column("video_id")
    .execute();

  await db.schema
    .createIndex("video_views_user_id_idx")
    .on("video_views")
    .column("user_id")
    .execute();

  await db.schema
    .createIndex("video_views_created_at_idx")
    .on("video_views")
    .column("created_at")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("video_views").execute();
}
