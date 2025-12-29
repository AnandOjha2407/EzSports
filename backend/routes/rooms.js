import express from 'express';
import Room from '../models/Room.js';
import User from '../models/User.js';
import { authenticate, requireCreator } from '../middleware/auth.js';

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({}).populate('creatorId', 'username email');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// IMPORTANT: Specific routes must come before the generic /:id route
// Get live rooms
router.get('/live/all', async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'live' }).populate('creatorId', 'username email');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my rooms (creator's rooms) - must come before /:id
router.get('/my-rooms/all', authenticate, requireCreator, async (req, res) => {
  try {
    const rooms = await Room.find({ creatorId: req.user._id })
      .populate('creatorId', 'username email');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rooms by game
router.get('/game/:gameType', async (req, res) => {
  try {
    const rooms = await Room.find({ gameType: req.params.gameType })
      .populate('creatorId', 'username email');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get room by ID - must come last to avoid matching specific routes
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('creatorId', 'username email');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create room
router.post('/create', authenticate, requireCreator, async (req, res) => {
  try {
    const roomData = {
      ...req.body,
      creatorId: req.user._id,
      creatorUsername: req.user.username,
    };

    const room = new Room(roomData);
    await room.save();

    // Update creator stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalRooms': 1 },
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update room
router.put('/:id', authenticate, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is the creator - handle both ObjectId and populated cases
    const roomCreatorId = room.creatorId?._id?.toString() || room.creatorId?.toString();
    const userId = req.user._id?.toString();
    
    if (roomCreatorId !== userId) {
      return res.status(403).json({ message: 'Not authorized. Only the creator can update this room.' });
    }

    // Handle status changes
    if (req.body.status === 'live' && room.status !== 'live') {
      req.body.startedAt = new Date();
    }
    if (req.body.status === 'ended' && room.status !== 'ended') {
      req.body.endedAt = new Date();
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete room
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is the creator - handle both ObjectId and populated cases
    const roomCreatorId = room.creatorId?._id?.toString() || room.creatorId?.toString();
    const userId = req.user?._id?.toString();
    
    if (!roomCreatorId || !userId || roomCreatorId !== userId) {
      return res.status(403).json({ message: 'Not authorized. Only the creator can delete this room.' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Go live
router.post('/:id/go-live', authenticate, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is the creator - handle both ObjectId and populated cases
    const roomCreatorId = room.creatorId?._id?.toString() || room.creatorId?.toString();
    const userId = req.user._id?.toString();
    
    if (roomCreatorId !== userId) {
      return res.status(403).json({ message: 'Not authorized. Only the creator can go live.' });
    }

    room.status = 'live';
    room.startedAt = new Date();
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// End room
router.post('/:id/end', authenticate, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is the creator - handle both ObjectId and populated cases
    const roomCreatorId = room.creatorId?._id?.toString() || room.creatorId?.toString();
    const userId = req.user._id?.toString();
    
    if (roomCreatorId !== userId) {
      return res.status(403).json({ message: 'Not authorized. Only the creator can end this room.' });
    }

    room.status = 'ended';
    room.endedAt = new Date();
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

