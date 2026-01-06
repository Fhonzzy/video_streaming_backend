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
            .createTable("jobs")
            .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
            .addColumn("type", "text", (col) => col.notNull())
            .addColumn("payload", "jsonb", (col) => col.notNull())
            .addColumn("status", "text", (col) => col.notNull().defaultTo("pending"))
            .addColumn("attempts", "integer", (col) => col.notNull().defaultTo(0))
            .addColumn("max_attempts", "integer", (col) => col.notNull().defaultTo(3))
            .addColumn("run_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .addColumn("locked_at", "timestamptz")
            .addColumn("error", "text")
            .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `now()`))
            .execute();
        // Index for job polling
        yield db.schema
            .createIndex("jobs_polling_idx")
            .on("jobs")
            .columns(["status", "run_at"])
            .execute();
        // Index for worker locking
        yield db.schema
            .createIndex("jobs_locked_at_idx")
            .on("jobs")
            .column("locked_at")
            .execute();
    });
}
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("jobs").execute();
    });
}
