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
        yield db.schema
            .createTable("video_assets")
            .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
            .addColumn("tenant_id", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
            .addColumn("video_id", "uuid", (col) => col.notNull().references("videos.id").onDelete("cascade"))
            .addColumn("type", "text", (col) => col
            .notNull()
            .check((0, kysely_1.sql) `type IN ('hls', 'dash', 'mp4', 'webm', 'jpg', 'png')`))
            .addColumn("format", "text", (col) => col
            .notNull()
            .check((0, kysely_1.sql) `format IN ('hls', 'dash', 'mp4', 'webm', 'jpg', 'png')`))
            .addColumn("codec", "text")
            .addColumn("resolution", "text")
            .addColumn("bitrate", "integer")
            .addColumn("duration_seconds", "integer")
            .addColumn("storage_key", "text", (col) => col.notNull())
            .addColumn("status", "text", (col) => col
            .notNull()
            .defaultTo("pending")
            .check((0, kysely_1.sql) `status IN ('pending', 'processing', 'ready', 'failed')`))
            .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .execute();
        yield db.schema
            .createIndex("video_assets_video_id_idx")
            .on("video_assets")
            .column("video_id")
            .execute();
        yield db.schema
            .createIndex("video_assets_tenant_id_idx")
            .on("video_assets")
            .column("tenant_id")
            .execute();
        yield db.schema
            .createIndex("video_assets_status_idx")
            .on("video_assets")
            .column("status")
            .execute();
    });
}
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("video_assets").execute();
    });
}
