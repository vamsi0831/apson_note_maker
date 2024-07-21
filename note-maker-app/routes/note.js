const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const note = new Note({
    ...req.body,
    userId: req.user._id
  });
  try {
    await note.save();
    res.status(201).send(note);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id, deletedAt: null });
    res.send(notes);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/search', auth, async (req, res) => {
  const { query } = req.query;
  try {
    const notes = await Note.find({
      userId: req.user._id,
      deletedAt: null,
      $or: [
        { content: new RegExp(query, 'i') },
        { tags: new RegExp(query, 'i') }
      ]
    });
    res.send(notes);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/label/:label', auth, async (req, res) => {
  const { label } = req.params;
  try {
    const notes = await Note.find({
      userId: req.user._id,
      deletedAt: null,
      tags: label
    });
    res.send(notes);
  } catch (e) {
    res.status(500).send();
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/:id/archive', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { archived: true },
      { new: true }
    );
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/:id/unarchive', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { archived: false },
      { new: true }
    );
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/:id/restore', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { deletedAt: null },
      { new: true }
    );
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;