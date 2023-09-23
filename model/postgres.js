const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "test",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PWD,
});

module.exports = client;
