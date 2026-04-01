const express = require("express");
const router = express.Router();
const Note = require("../models/Notes.js");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id }).sort({
    isPinned: -1,
    createdAt: -1
  });
  res.json(notes);
});

router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.create({
    userId: req.user.id,
    title,
    content
  });
  res.json(note);
});

router.put("/:id", auth, async (req, res) => {
  const { title, content, isPinned } = req.body;
  const updated = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { title, content, isPinned },
    { returnDocument:"after"}
  );
  
  if (!updated) {
    return res.status(404).json({ msg: "Note not found or unauthorized" });
  }
  res.json(updated);
});

router.delete("/:id", auth, async (req, res) => {
  const deletedNote = await Note.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!deletedNote) {
    return res.status(404).json({ msg: "Note not found or unauthorized" });
  }
  res.json({ msg: "Deleted" });
});
router.get("/share/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ msg: "Note not found or deleted" });
    }

    // Sirf title aur content bhej rahe hain security ke liye
    res.json({ title: note.title, content: note.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;