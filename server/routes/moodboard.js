const express = require('express');
const router = express.Router();
const MoodBoard = require('../models/MoodBoard');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

// Create new moodboard
router.post('/', async (req, res) => {
  try {
    const { emojis, imageUrl, color, note } = req.body;
    if (!emojis || !imageUrl || !color || !note) {
      return res.status(400).json({
        message: 'Please provide all fields'
      });
    }
    if (note.length > 200) {
      return res.status(400).json({
        message: 'Note must be 200 characters or less'
      });
    }
    // Check if user already created moodboard today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const existingMoodboard = await MoodBoard.findOne({
      user: req.user.userId,
      date: { $gte: today, $lt: tomorrow }
    });
    if (existingMoodboard) {
      return res.status(400).json({
        message: 'You have already created a moodboard today.'
      });
    }
    const moodboard = new MoodBoard({
      user: req.user.userId,
      emojis,
      imageUrl,
      color,
      note,
      date: new Date()
    });
    await moodboard.save();
    res.status(201).json({
      message: 'MoodBoard created successfully',
      moodboard
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Get today's moodboard
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const moodboard = await MoodBoard.findOne({
      user: req.user.userId,
      date: { $gte: today, $lt: tomorrow }
    });
    if (!moodboard) {
      return res.status(404).json({
        message: 'No moodboard created today'
      });
    }
    res.json(moodboard);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all moodboards
router.get('/', async (req, res) => {
  try {
    const moodboards = await MoodBoard.find({
      user: req.user.userId
    }).sort({ date: -1 });
    res.json(moodboards);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const moodboard = await MoodBoard.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    if (!moodboard) {
      return res.status(404).json({ message: 'MoodBoard not found' });
    }
    res.json({ message: 'MoodBoard deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
