const client = require("../model/postgres");

const getAllUsers = async (req, res) => {
  await client.connect();
  const result = await client.query("SELECT * FROM users");
  res.json(result.rows);
  await client.end();
};

module.exports = { getAllUsers };
