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
            .createTable("video_views")
            .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
            .addColumn("tenant_id", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
            .addColumn("video_id", "uuid", (col) => col.notNull().references("videos.id").onDelete("cascade"))
            .addColumn("user_id", "uuid", (col) => col.references("users.id").onDelete("set null"))
            .addColumn("ip_hash", "text")
            .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .execute();
        //Indexes for analytics & performance
        yield db.schema
            .createIndex("video_views_video_id_idx")
            .on("video_views")
            .column("video_id")
            .execute();
        yield db.schema
            .createIndex("video_views_user_id_idx")
            .on("video_views")
            .column("user_id")
            .execute();
        yield db.schema
            .createIndex("video_views_created_at_idx")
            .on("video_views")
            .column("created_at")
            .execute();
    });
}
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("video_views").execute();
    });
}
