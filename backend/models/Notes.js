const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: String,
  content: String,
  isPinned: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });
noteSchema.index({ "deletedAt": 1 }, { expireAfterSeconds: 1296000 });

module.exports = mongoose.model("Notes", noteSchema);