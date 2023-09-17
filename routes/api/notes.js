const express = require("express");
const router = express.Router();
const notesController = require("../../controllers/notesController");

router
  .route("/")
  .get(notesController.getAllNotes)
  .post(notesController.createNote)
  .put(notesController.updateNote)
  .delete(notesController.deleteNote);

router.route("/:id").get(notesController.getNote);

module.exports = router;
