import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // tags table
  await db.schema
    .createTable("tags")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )

    .addColumn("name", "text", (col) => col.notNull().unique())

    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )

    .execute();

  // video_tags join table
  await db.schema
    .createTable("video_tags")
    .addColumn("video_id", "uuid", (col) =>
      col.notNull().references("videos.id").onDelete("cascade")
    )

    .addColumn("tag_id", "uuid", (col) =>
      col.notNull().references("tags.id").onDelete("cascade")
    )

    .execute();

  // Composite primary key (no duplicates)
  await db.schema
    .createIndex("video_tags_pk")
    .on("video_tags")
    .columns(["video_id", "tag_id"])
    .unique()
    .execute();

  // Performance indexes
  await db.schema
    .createIndex("video_tags_video_id_idx")
    .on("video_tags")
    .column("video_id")
    .execute();

  await db.schema
    .createIndex("video_tags_tag_id_idx")
    .on("video_tags")
    .column("tag_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("video_tags").execute();
  await db.schema.dropTable("tags").execute();
}
