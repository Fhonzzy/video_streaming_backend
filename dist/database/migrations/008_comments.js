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
            .createTable("comments")
            .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
            .addColumn("tenant_id", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
            .addColumn("video_id", "uuid", (col) => col.notNull().references("videos.id").onDelete("cascade"))
            .addColumn("user_id", "uuid", (col) => col.notNull().references("users.id").onDelete("cascade"))
            .addColumn("parent_id", "uuid", (col) => col.references("comments.id").onDelete("cascade"))
            .addColumn("content", "text", (col) => col.notNull())
            .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .execute();
        //Indexes for fast reads
        yield db.schema
            .createIndex("comments_video_id_idx")
            .on("comments")
            .column("video_id")
            .execute();
        yield db.schema
            .createIndex("comments_parent_id_idx")
            .on("comments")
            .column("parent_id")
            .execute();
        yield db.schema
            .createIndex("comments_created_at_idx")
            .on("comments")
            .column("created_at")
            .execute();
    });
}
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("comments").execute();
    });
}
