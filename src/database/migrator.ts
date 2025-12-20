import "dotenv/config";
import {
  Kysely,
  PostgresDialect,
  Migrator,
  FileMigrationProvider,
} from "kysely";
import { Pool } from "pg";
import path from "path";
import fs from "fs/promises";

console.log("DB URL:", process.env.DATABASE_URL);

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

const migrationFolder = path.resolve(__dirname, "migrations");

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: migrationFolder,
  }),
});

async function runMigrations() {
  const direction = process.argv[2];

  if (!["up", "down", "latest"].includes(direction)) {
    console.error("Usage: npm run migrate:up | migrate:down | migrate:latest");
    process.exit(1);
  }

  console.log(`Running migration: ${direction}`);

  const result =
    direction === "up"
      ? await migrator.migrateUp()
      : direction === "down"
      ? await migrator.migrateDown()
      : await migrator.migrateToLatest();

  if (result.error) {
    console.error("Migration failed");
    console.error(result.error);
    process.exit(1);
  }

  console.log("Migration completed successfully");
  await db.destroy();
}

runMigrations();
