// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// async function testConnection() {
//   try {
//     const res = await pool.query("SELECT NOW()");
//     console.log("✅ Database connected successfully!");
//     console.log("Current time:", res.rows[0].now);
//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Connection failed:", err.message);
//     process.exit(1);
//   }
// }

// testConnection();


//only for production
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

// Test connection once on startup
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
  } else {
    console.log("✅ PostgreSQL connected at:", res.rows[0].now);
  }
});

module.exports = pool;



module.exports = pool;
