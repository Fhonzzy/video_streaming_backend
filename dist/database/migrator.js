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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const kysely_1 = require("kysely");
const pg_1 = require("pg");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
console.log("DB URL:", process.env.DATABASE_URL);
const db = new kysely_1.Kysely({
    dialect: new kysely_1.PostgresDialect({
        pool: new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
});
const migrationFolder = path_1.default.resolve(__dirname, "migrations");
const migrator = new kysely_1.Migrator({
    db,
    provider: new kysely_1.FileMigrationProvider({
        fs: promises_1.default,
        path: path_1.default,
        migrationFolder: migrationFolder,
    }),
});
function runMigrations() {
    return __awaiter(this, void 0, void 0, function* () {
        const direction = process.argv[2];
        if (!["up", "down", "latest"].includes(direction)) {
            console.error("Usage: npm run migrate:up | migrate:down | migrate:latest");
            process.exit(1);
        }
        console.log(`Running migration: ${direction}`);
        const result = direction === "up"
            ? yield migrator.migrateUp()
            : direction === "down"
                ? yield migrator.migrateDown()
                : yield migrator.migrateToLatest();
        if (result.error) {
            console.error("Migration failed");
            console.error(result.error);
            process.exit(1);
        }
        console.log("Migration completed successfully");
        yield db.destroy();
    });
}
runMigrations();
