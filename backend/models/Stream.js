import mongoose from 'mongoose';

const streamSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  creatorUsername: {
    type: String,
    required: true,
  },
  gameType: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    enum: ['youtube', 'twitch'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  streamUrl: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  isLive: {
    type: Boolean,
    default: false,
  },
  viewerCount: {
    type: Number,
    default: 0,
  },
  peakViewers: {
    type: Number,
    default: 0,
  },
  startedAt: {
    type: Date,
    default: null,
  },
  endedAt: {
    type: Date,
    default: null,
  },
  metadata: {
    tags: { type: [String], default: [] },
    category: { type: String, default: 'gaming' },
    language: { type: String, default: 'en' },
  },
}, {
  timestamps: true,
});

export default mongoose.model('Stream', streamSchema);

