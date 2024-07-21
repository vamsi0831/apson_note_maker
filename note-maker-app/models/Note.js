const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  content: String,
  tags: [String],
  color: String,
  archived: { type: Boolean, default: false },
  deletedAt: Date
});

module.exports = mongoose.model('Note', NoteSchema);