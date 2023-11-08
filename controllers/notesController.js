const pool = require("../config/postgres");

const getAllNotes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
};

const createNote = async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO posts VALUES (default,'${req.body.title}','${req.body.content}')`
    );
    res.send("posts created");
  } catch (err) {
    console.log(err);
  }
};

const updateNote = (req, res) => {
  res.json({
    title: req.body.title,
    text: req.body.text,
  });
};

const deleteNote = (req, res) => {
  res.json({ id: req.body.id });
};

const getNote = (req, res) => {
  res.json({ id: req.params.id });
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getNote,
};
