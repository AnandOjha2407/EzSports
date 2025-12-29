import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
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
  roomName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  credentials: {
    type: Object,
    default: {},
  },
  streamLinks: {
    youtube: { type: String, default: null },
    twitch: { type: String, default: null },
  },
  maxPlayers: {
    type: Number,
    default: 100,
  },
  currentPlayers: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended'],
    default: 'scheduled',
  },
  scheduledTime: {
    type: Date,
    default: null,
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
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    category: { type: String, default: 'custom' },
    difficulty: { type: String, default: 'medium' },
    region: { type: String, default: 'global' },
  },
  analytics: {
    peakViewers: { type: Number, default: 0 },
    averageViewers: { type: Number, default: 0 },
    totalViewers: { type: Number, default: 0 },
    joinRate: { type: Number, default: 0 },
    retentionRate: { type: Number, default: 0 },
  },
  settings: {
    isPublic: { type: Boolean, default: true },
    allowSpectators: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    autoStart: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
});

export default mongoose.model('Room', roomSchema);

