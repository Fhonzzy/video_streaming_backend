import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("comments")
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
      col.notNull().references("users.id").onDelete("cascade")
    )

    .addColumn("parent_id", "uuid", (col) =>
      col.references("comments.id").onDelete("cascade")
    )

    .addColumn("content", "text", (col) => col.notNull())

    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )

    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )

    .execute();

  //Indexes for fast reads
  await db.schema
    .createIndex("comments_video_id_idx")
    .on("comments")
    .column("video_id")
    .execute();

  await db.schema
    .createIndex("comments_parent_id_idx")
    .on("comments")
    .column("parent_id")
    .execute();

  await db.schema
    .createIndex("comments_created_at_idx")
    .on("comments")
    .column("created_at")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("comments").execute();
}
