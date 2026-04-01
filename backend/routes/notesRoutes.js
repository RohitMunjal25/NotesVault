const express = require("express");
const router = express.Router();
const Note = require("../models/Notes.js");
const auth = require("../middleware/authMiddleware");
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({
      isPinned: -1, 
      updatedAt: -1 
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({
      userId: req.user.id,
      title,
      content
    });
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content, isPinned } = req.body;
    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, content, isPinned },
      { new: true } // 'returnDocument: after' ki jagah 'new: true' zyada standard hai
    );
    
    if (!updated) {
      return res.status(404).json({ msg: "Note not found or unauthorized" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!deletedNote) {
      return res.status(404).json({ msg: "Note not found or unauthorized" });
    }
    res.json({ msg: "Deleted Forever" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;