import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("video_assets")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("tenant_id", "uuid", (col) =>
      col.notNull().references("tenants.id").onDelete("cascade")
    )
    .addColumn("video_id", "uuid", (col) =>
      col.notNull().references("videos.id").onDelete("cascade")
    )
    .addColumn("type", "text", (col) =>
      col
        .notNull()
        .check(sql`type IN ('hls', 'dash', 'mp4', 'webm', 'jpg', 'png')`)
    )
    .addColumn("format", "text", (col) =>
      col
        .notNull()
        .check(sql`format IN ('hls', 'dash', 'mp4', 'webm', 'jpg', 'png')`)
    )
    .addColumn("codec", "text")
    .addColumn("resolution", "text")
    .addColumn("bitrate", "integer")
    .addColumn("duration_seconds", "integer")
    .addColumn("storage_key", "text", (col) => col.notNull())
    .addColumn("status", "text", (col) =>
      col
        .notNull()
        .defaultTo("pending")
        .check(sql`status IN ('pending', 'processing', 'ready', 'failed')`)
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createIndex("video_assets_video_id_idx")
    .on("video_assets")
    .column("video_id")
    .execute();

  await db.schema
    .createIndex("video_assets_tenant_id_idx")
    .on("video_assets")
    .column("tenant_id")
    .execute();

  await db.schema
    .createIndex("video_assets_status_idx")
    .on("video_assets")
    .column("status")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("video_assets").execute();
}
