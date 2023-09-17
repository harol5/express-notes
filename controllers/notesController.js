const data = {};
data.notes = require("../model/notes.json");

const getAllNotes = (req, res) => {
  res.json(data.notes);
  res.send(data.notes);
};

const createNote = (req, res) => {
  res.json({
    title: req.body.title,
    text: req.body.text,
  });
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
