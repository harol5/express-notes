const pool = require("../config/postgres");

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getAllUsers };
