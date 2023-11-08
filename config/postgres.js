const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.POSTGRES_HT,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PWD,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
