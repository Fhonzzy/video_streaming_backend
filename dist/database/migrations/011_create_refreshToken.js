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
            .createTable("refresh_tokens")
            .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
            .addColumn("user_id", "uuid", (col) => col.notNull().references("users.id").onDelete("cascade"))
            .addColumn("token_hash", "text", (col) => col.notNull())
            .addColumn("expires_at", "timestamptz", (col) => col.notNull())
            .addColumn("revoked_at", "timestamptz")
            .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .execute();
        yield db.schema
            .createIndex("refresh_tokens_user_id_idx")
            .on("refresh_tokens")
            .column("user_id")
            .execute();
    });
}
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("refresh_tokens").execute();
    });
}
