const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
    },
    clubName: {
      type: String,
      required: [true, 'Please provide organizing club name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select event category'],
      enum: [
        'Symposium',
        'Workshop',
        'Hackathon',
        'Paper Presentation',
        'Tech Seminar',
        'Coding Contest',
      ],
      default: 'Workshop',
    },
    department: {
      type: String,
      required: [true, 'Please select department'],
      enum: [
        'CSE',
        'IT',
        'ECE',
        'AI & DS',
        'Mechanical',
        'Biotechnology',
        'All Departments',
      ],
      default: 'All Departments',
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide event time range (e.g., 09:30 AM - 04:00 PM)'],
      default: '09:30 AM - 04:00 PM',
    },
    venue: {
      type: String,
      required: [true, 'Please provide event venue or hall'],
      default: 'Main Campus Auditorium',
    },
    totalSeats: {
      type: Number,
      required: [true, 'Please provide total seat capacity'],
      min: [1, 'Total seats must be at least 1'],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative'],
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    fee: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    bannerGradient: {
      type: String,
      default: 'from-indigo-600 via-purple-600 to-pink-500',
    },
    organizerContact: {
      name: { type: String, default: 'Jaishree K (Faculty / Student Head)' },
      email: { type: String, default: 'jaishree.organizer@sympora.edu' },
      phone: { type: String, default: '+91 98765 43210' },
    },
    status: {
      type: String,
      enum: ['open', 'filling-fast', 'sold-out', 'completed'],
      default: 'open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate availableSeats and status
eventSchema.pre('save', function (next) {
  if (this.isModified('totalSeats') || this.isModified('registeredCount')) {
    this.availableSeats = Math.max(0, this.totalSeats - (this.registeredCount || 0));
    
    if (this.availableSeats === 0) {
      this.status = 'sold-out';
    } else if (this.availableSeats <= Math.ceil(this.totalSeats * 0.2)) {
      this.status = 'filling-fast';
    } else {
      this.status = 'open';
    }
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
