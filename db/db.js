
//only for development
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});




//only for production

// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     require: true,
//     rejectUnauthorized: false,
//   },
// });




// Test connection once on startup
// pool.query("SELECT NOW()", (err, res) => {
//   if (err) {
//     console.error("❌ PostgreSQL connection failed:", err.message);
//   } else {
//     console.log("✅ PostgreSQL connected at:", res.rows[0].now);
//   }
// });



module.exports = pool;


