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
            .createTable("upload_sessions")
            .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
            .addColumn("tenant_id", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
            .addColumn("user_id", "uuid", (col) => col.notNull().references("users.id").onDelete("cascade"))
            .addColumn("status", "text", (col) => col
            .notNull()
            .defaultTo("initiated")
            .check((0, kysely_1.sql) `status IN ('initiated', 'uploading', 'completed', 'failed')`))
            .addColumn("file_name", "text", (col) => col.notNull())
            .addColumn("mime_type", "text", (col) => col.notNull())
            .addColumn("file_size", "bigint", (col) => col.notNull().check((0, kysely_1.sql) `file_size > 0`))
            .addColumn("uploaded_byte", "bigint", (col) => col.notNull().defaultTo(0))
            .addColumn("storage_key", "text", (col) => col.notNull())
            .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .execute();
        yield db.schema
            .createIndex("upload_sessions_tenant_id_idx")
            .on("upload_sessions")
            .column("tenant_id")
            .execute();
        yield db.schema
            .createIndex("upload_sessions_user_id_idx")
            .on("upload_sessions")
            .column("user_id")
            .execute();
        yield db.schema
            .createIndex("upload_sessions_status_idx")
            .on("upload_sessions")
            .column("status")
            .execute();
    });
}
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("upload_sessions").execute();
    });
}
