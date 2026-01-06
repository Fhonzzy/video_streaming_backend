"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
function up(db) {
    return __awaiter(this, void 0, void 0, function* () {
        // tags table
        yield db.schema
            .createTable("tags")
            .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
            .addColumn("name", "text", (col) => col.notNull().unique())
            .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .execute();
        // video_tags join table
        yield db.schema
            .createTable("video_tags")
            .addColumn("video_id", "uuid", (col) => col.notNull().references("videos.id").onDelete("cascade"))
            .addColumn("tag_id", "uuid", (col) => col.notNull().references("tags.id").onDelete("cascade"))
            .execute();
        // Composite primary key (no duplicates)
        yield db.schema
            .createIndex("video_tags_pk")
            .on("video_tags")
            .columns(["video_id", "tag_id"])
            .unique()
            .execute();
        // Performance indexes
        yield db.schema
            .createIndex("video_tags_video_id_idx")
            .on("video_tags")
            .column("video_id")
            .execute();
        yield db.schema
            .createIndex("video_tags_tag_id_idx")
            .on("video_tags")
            .column("tag_id")
            .execute();
    });
}
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("video_tags").execute();
        yield db.schema.dropTable("tags").execute();
    });
}
