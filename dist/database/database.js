"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const kysely_1 = require("kysely");
exports.db = new kysely_1.Kysely({
    dialect: new kysely_1.PostgresDialect({
        pool: new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
});
