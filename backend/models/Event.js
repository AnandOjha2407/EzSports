import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  gameType: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ['tournament', 'update', 'patch', 'giveaway'],
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended', 'cancelled'],
    default: 'scheduled',
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  link: {
    type: String,
    default: null,
  },
  metadata: {
    organizer: { type: String, default: null },
    prizePool: { type: String, default: null },
    participants: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
  },
}, {
  timestamps: true,
});

export default mongoose.model('Event', eventSchema);

