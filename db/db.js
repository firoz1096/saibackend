const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

// Test connection once on startup
pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("✅ PostgreSQL connected at:", res.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err);
  });

module.exports = pool;
