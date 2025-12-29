import express from 'express';
import Stream from '../models/Stream.js';
import { authenticate, requireCreator } from '../middleware/auth.js';

const router = express.Router();

// Get all streams
router.get('/', async (req, res) => {
  try {
    const streams = await Stream.find({}).populate('creatorId', 'username email');
    res.json(streams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get live streams
router.get('/live/all', async (req, res) => {
  try {
    const streams = await Stream.find({ isLive: true })
      .populate('creatorId', 'username email');
    res.json(streams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get streams by game
router.get('/game/:gameType', async (req, res) => {
  try {
    const streams = await Stream.find({
      gameType: req.params.gameType,
      isLive: true,
    }).populate('creatorId', 'username email');
    res.json(streams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my streams (creator's streams)
router.get('/my-streams/all', authenticate, requireCreator, async (req, res) => {
  try {
    const streams = await Stream.find({ creatorId: req.user._id })
      .populate('creatorId', 'username email');
    res.json(streams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add stream
router.post('/add', authenticate, requireCreator, async (req, res) => {
  try {
    const streamData = {
      ...req.body,
      creatorId: req.user._id,
      creatorUsername: req.user.username,
    };

    if (streamData.isLive) {
      streamData.startedAt = new Date();
    }

    const stream = new Stream(streamData);
    await stream.save();

    res.status(201).json(stream);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update stream
router.put('/:id', authenticate, requireCreator, async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({ message: 'Stream not found' });
    }

    // Check if user is the creator - handle both ObjectId and populated cases
    const streamCreatorId = stream.creatorId?._id?.toString() || stream.creatorId?.toString();
    const userId = req.user._id?.toString();
    
    if (streamCreatorId !== userId) {
      return res.status(403).json({ message: 'Not authorized. Only the creator can update this stream.' });
    }

    const updatedStream = await Stream.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedStream);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete stream
router.delete('/:id', authenticate, requireCreator, async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({ message: 'Stream not found' });
    }

    // Check if user is the creator - handle both ObjectId and populated cases
    const streamCreatorId = stream.creatorId?._id?.toString() || stream.creatorId?.toString();
    const userId = req.user?._id?.toString();
    
    if (!streamCreatorId || !userId || streamCreatorId !== userId) {
      return res.status(403).json({ message: 'Not authorized. Only the creator can delete this stream.' });
    }

    await Stream.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stream deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

